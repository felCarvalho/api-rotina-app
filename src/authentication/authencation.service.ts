import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
      return null;
    }

    const findIdentifier =
      await this.credentialsRepository.findCredByIdentifier(identifier);

    if (!findIdentifier) {
      return null;
    }

    const findPassHash = await this.passHashRepository.findPassHashById(
      findIdentifier.user.id,
    );

    if (!findPassHash) {
      return null;
    }

    const passwordMatch = await argon2.verify(findPassHash.hash, passHash);

    if (!passwordMatch) {
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
      role: userRole?.role.slug,
    });

    if (!accessToken) {
      return Result.err('token inválido');
    }

    const user = userRole?.user;

    if (!user) {
      return Result.err('problemas ao encontrar seu usuário');
    }

    const tokenId = uuidv4();

    const refreshToken = await this.jwtService.signAsync(
      {
        identifier: identifier,
        sub: userId,
        role: userRole?.role.name,
        tokenId,
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
      id: tokenId,
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
        seconds: 60 * 1,
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
    refreshTokenPayload: RefreshTokenPayload,
    sessionId: string,
  ) {
    /*  const identifier = refreshTokenPayload.identifier;
    const dateCreate = refreshTokenPayload.iat;
    const dateExp = refreshTokenPayload.exp;
    const role = refreshTokenPayload.role;
    const userId = refreshTokenPayload.sub;
    const tokenId = refreshTokenPayload.tokenId;
    console.log('identifier: ' + identifier);
    console.log('dateCreate: ' + dateCreate);
    console.log('dateExp; ' + dateExp);
    console.log('role: ' + role);
    console.log('userId: ' + userId);
    console.log('tokenId: ' + tokenId);*/
    if (
      !sessionId ||
      !refreshTokenPayload.identifier ||
      !refreshTokenPayload.sub ||
      !refreshTokenPayload.role ||
      !refreshTokenPayload.tokenId
    ) {
      console.log(1);
      return null;
    }

    const findRefreshTokenStore = await this.memory.hGetBy({
      key: `sessionId:${sessionId}`,
      field: 'refreshToken',
    });

    if (!findRefreshTokenStore) {
      return null;
    }

    const findCredentials =
      await this.credentialsRepository.findCredByIdentifier(
        refreshTokenPayload.identifier,
      );

    if (!findCredentials) {
      console.log(2);
      return null;
    }

    const findUser = await this.userRepository.findByUserId(
      refreshTokenPayload.sub,
    );

    if (!findUser) {
      console.log(3);
      return null;
    }

    const findRefreshToken =
      await this.refreshTokenRepository.findByRefreshTokenId(
        refreshTokenPayload.tokenId,
      );

    if (findRefreshToken?.status === 'inativo') {
      throw new UnauthorizedException(
        'Ops, token de longa duração expirado ou inválido',
      );
    }

    if (!findRefreshToken) {
      console.log(4);
      return null;
    }

    const compareRefreshToken = await argon2.verify(
      findRefreshToken.refreshHash,
      findRefreshTokenStore,
    );

    if (!compareRefreshToken) {
      console.log(5);
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
      },
    );

    if (!accessTokenCreated) {
      console.log(6);
      return null;
    }

    const tokenId = uuidv4();

    const refreshTokenCreated = await this.jwtService.signAsync(
      {
        identifier: refreshTokenPayload.identifier,
        sub: refreshTokenPayload.sub,
        role: refreshTokenPayload.role,
        tokenId: tokenId,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '1d',
      },
    );

    if (!refreshTokenCreated) {
      console.log(7);
      return null;
    }

    const refreshTokenHash = await argon2.hash(refreshTokenCreated);

    const date = new Date();

    this.refreshTokenRepository.createRefreshToken({
      id: tokenId,
      user: findUser,
      status: 'ativo',
      refreshHash: refreshTokenHash,
      created_at: date,
      updated_at: date,
      deleted_at: null,
    });

    try {
      const sessionId = uuidv4();

      findRefreshToken.status = 'inativo';

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
        seconds: 60 * 1,
      });
      await this.memory.hExp({
        key: `sessionId:${sessionId}`,
        field: 'refreshToken',
        seconds: 60 * 60 * 24,
      });

      //save para salvar no db
      await this.unitOfWork.save();

      return sessionId;
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
