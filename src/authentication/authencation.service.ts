import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CredentialsRepository } from './repository/credentials.repository';
import { PasswordHashRepository } from './repository/pashHash.repository';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { UserRepository } from '../user/user.repository';
import { Result } from '../shared/result-pattern/result';
import { Builder } from 'builder-pattern';
import { Credentials } from './entity/credentials.entity';
import { User } from '../user/user.entity';
import { PassHash } from './entity/passHash.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './entity/refresh-token.entity';
import { RefreshTokenPayload } from '../shared/interface/interface';
import { UnitOfWorkAbstract } from '../shared/uniOfWork/unitOfWork';
import { RoleRepository } from './repository/role.repository';
import { v4 as uuidv4 } from 'uuid';
import { MemoryAbstract } from '../shared/redis/redis';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly passHashRepository: PasswordHashRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly unitOfWork: UnitOfWorkAbstract,
    private readonly memory: MemoryAbstract,
  ) {}

  async validateUser(identifier: string, passHash: string) {
    if (!identifier.trim() || !passHash.trim()) {
      console.log(1);
      return null;
    }

    const findIdentifier =
      await this.credentialsRepository.findCredByIdentifier(identifier);

    if (!findIdentifier) {
      console.log(2);
      return null;
    }

    const findPassHash = await this.passHashRepository.findPassHashById(
      findIdentifier.user.id,
    );

    if (!findPassHash) {
      console.log(3);
      return null;
    }

    const passwordMatch = await argon2.verify(findPassHash.hash, passHash);

    if (!passwordMatch) {
      console.log(4);
      return null;
    }

    return {
      identifier: findIdentifier.identifier,
      userId: findIdentifier.user.id,
    };
  }

  public async login(identifier: string, userId: string) {
    if (!identifier.trim() || !userId.trim()) {
      return Result.err('usuario inválido');
    }

    const findUserRoles = await this.userRepository.findByUserId(userId);

    if (!findUserRoles) {
      return Result.err('usuario inválido');
    }

    const userRole = findUserRoles.userRoles
      .getItems()
      .find((s) => s.role.slug === 'USER');

    const accessToken = await this.jwtService.signAsync({
      identifier: identifier,
      sub: userId,
      role: userRole?.role.name,
    });

    if (!accessToken) {
      return Result.err('token inválido');
    }

    const user = userRole?.user;

    if (!user) {
      return Result.err('problemas ao encontrar seu usuário');
    }

    const refreshToken = await this.jwtService.signAsync(
      {
        identifier: identifier,
        sub: userId,
        role: userRole?.role.name,
        tokenId: uuidv4(),
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '1d',
      },
    );

    const refreshTokenHash = await argon2.hash(refreshToken);

    const date = new Date();

    const refreshTokenCreated = this.refreshTokenRepository.createRefreshToken({
      refreshHash: refreshTokenHash,
      status: 'ativo',
      user: user,
      created_at: date,
      updated_at: date,
      id: uuidv4(),
      deleted_at: null,
    });

    this.unitOfWork.state(refreshTokenCreated);

    try {
      const sessionId = uuidv4();

      await this.memory.hSetAll({
        key: `sessionId:${sessionId}`,
        value: { accessToken, refreshToken },
      });
      await this.memory.hExp({
        key: `sessionId:${sessionId}`,
        field: 'accessToken',
        seconds: 60 * 15,
      });
      await this.memory.hExp({
        key: `sessionId:${sessionId}`,
        field: 'refreshToken',
        seconds: 60 * 60 * 24,
      });

      await this.unitOfWork.save();

      return sessionId;
    } catch (e: any) {
      console.log(e);
      return Result.err(
        'Tivemos um problema ao realizar seu login, tente novamente mais tarde.' +
          e,
      );
    }
  }

  public async verifyRefreshToken(
    refreshToken: string,
    refreshTokenPayload: RefreshTokenPayload,
  ) {
    if (
      !refreshToken ||
      !refreshTokenPayload.identifier ||
      !refreshTokenPayload.sub ||
      !refreshTokenPayload.role ||
      !refreshTokenPayload.tokenId
    ) {
      return null;
    }

    const findCredentials =
      await this.credentialsRepository.findCredByIdentifier(
        refreshTokenPayload.identifier,
      );

    if (!findCredentials) {
      return null;
    }

    const findUser = await this.userRepository.findByUserId(
      refreshTokenPayload.sub,
    );

    if (!findUser) {
      return null;
    }

    const findRefreshToken =
      await this.refreshTokenRepository.findByRefreshTokenId(
        refreshTokenPayload.tokenId,
      );

    if (!findRefreshToken) {
      return null;
    }

    const compareRefreshToken = await argon2.verify(
      refreshToken,
      findRefreshToken.refreshHash,
    );

    if (!compareRefreshToken) {
      return null;
    }

    const accessTokenCreated = await this.jwtService.signAsync(
      {
        identifier: refreshTokenPayload.identifier,
        sub: refreshTokenPayload.sub,
        role: refreshTokenPayload.role,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );

    if (!accessTokenCreated) {
      return null;
    }

    const refreshTokenCreated = await this.jwtService.signAsync(
      {
        identifier: refreshTokenPayload.identifier,
        sub: refreshTokenPayload.sub,
        role: refreshTokenPayload.role,
        tokenId: uuidv4(),
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '1d',
      },
    );

    if (!refreshTokenCreated) {
      return null;
    }

    const refreshTokenHash = await argon2.hash(refreshToken);

    const refreshTokenCreatedInitial = Builder<RefreshToken>()
      .status('ativo')
      .user(findUser)
      .refreshHash(refreshTokenHash)
      .build();

    this.refreshTokenRepository.createRefreshToken(refreshTokenCreatedInitial);

    try {
      const sessionId = uuidv4();

      //salva os tokens de acesso e refresh
      await this.memory.hSetAll({
        key: `sessionId:${sessionId}`,
        value: {
          accessToken: accessTokenCreated,
          refreshToken: refreshTokenCreated,
        },
      });

      //tempos de expirações de acordo com as durações de ambos
      await this.memory.hExp({
        key: `sessionId:${sessionId}`,
        field: 'accessToken',
        seconds: 60 * 15,
      });
      await this.memory.hExp({
        key: `sessionId:${sessionId}`,
        field: 'refreshToken',
        seconds: 60 * 60 * 24,
      });

      //commit para salvar no db
      await this.unitOfWork.commit();
    } catch (e: any) {
      throw new InternalServerErrorException(`error:: ${e}`);
    }
  }

  async findCredentialsByIdentifier(identifier: string) {
    if (!identifier.trim()) {
      return Result.err('identifier inválido');
    }

    return await this.credentialsRepository.findCredByIdentifier(identifier);
  }

  async verifyIdentifier(identifier: string) {
    if (!identifier.trim()) {
      return Result.err('identifier inválido');
    }
    const findIdentifier =
      await this.credentialsRepository.findCredByIdentifier(identifier);

    if (findIdentifier) {
      return Result.err('Ops, esse email já existe');
    }
  }

  public createCredentials(credentials: Credentials) {
    if (!credentials.identifier) {
      console.error(Result.err('Opa, email inválido'));
      return null;
    }

    if (!credentials.user.id) {
      console.log(Result.err('Opa, usuario inválido'));
      return null;
    }

    return this.credentialsRepository.createCred(credentials);
  }

  public async createPassHash(password: string, user: User) {
    if (!password) {
      console.log(Result.err('senha inválida'));
      return null;
    }

    const passwordHash = await argon2.hash(password);

    if (!passwordHash) {
      console.log(Result.err('erro ao gerar hash'));
      return null;
    }

    return Result.ok(passwordHash);
  }

  async findRole(slug: 'USER' | 'ADMIN' | 'GUEST') {
    return await this.roleRepository.findRoleBySlug(slug);
  }
}
