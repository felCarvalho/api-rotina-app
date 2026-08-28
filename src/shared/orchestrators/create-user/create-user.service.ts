import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthenticationService } from '../../../authentication/authencation.service';
import { UserService } from '../../../user/user.service';
import { CreateUserDto } from './create-user.dto';
import { Result } from '../../../shared/result-pattern/result';
import { Builder } from 'builder-pattern';
import { User } from '../../../user/user.entity';
import { UserRoles } from '../../../authentication/entity/userRoles.entity';
import { Credentials } from '../../../authentication/entity/credentials.entity';
import { UnitOfWorkAbstract } from '../../../shared/uniOfWork/unitOfWork';
import { EntityManager } from '@mikro-orm/postgresql';
import { Role } from '../../../authentication/entity/role.entity';
import { PassHash } from '../../../authentication/entity/passHash.entity';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly unitOfWork: UnitOfWorkAbstract,
  ) {}

  async createUserOrchestrator(createUser: CreateUserDto) {
    if (!createUser.identifier.trim()) {
      return Result.err('Email inválido');
    }

    if (!createUser.password.trim()) {
      return Result.err('Senha inválida');
    }

    if (!createUser.name.trim()) {
      return Result.err('Nome inválido');
    }

    if (!createUser.repeatPassword.trim()) {
      return Result.err('Repetição de senha inválida');
    }

    if (createUser.password !== createUser.repeatPassword) {
      return Result.err('Senha e repetição de senha não coincidem');
    }

    return await this.unitOfWork.transaction(async (em: EntityManager) => {
      const findExistsIdentifier = await em.findOne(Credentials, {
        identifier: createUser.identifier,
      });

      if (findExistsIdentifier) {
        throw new ConflictException({
          error: 'Ops, esse email já existe',
          success: false,
        });
      }

      const findRole = await em.findOne(Role, { slug: 'USER' });

      if (!findRole) {
        return Result.err('Ops, erro ao buscar role ');
      }

      const user = em.create(User, {
        name: createUser.name,
      });

      this.unitOfWork.state(user);

      const userRoles = em.create(UserRoles, {
        user: user,
        role: findRole,
      });

      user.userRoles.add(userRoles);

      this.unitOfWork.state(userRoles);

      if (!user) {
        return Result.err('Opa, erro ao criar usuario');
      }

      const createCredentials = em.create(Credentials, {
        user: user,
        provider: 'local',
        identifier: createUser.identifier,
      });

      this.unitOfWork.state(createCredentials);

      if (!createCredentials) {
        return Result.err('Opa, credentials não foi criada');
      }

      const generatePassHash = await this.authenticationService.createPassHash(
        createUser.password,
        user,
      );

      if (!generatePassHash?.success) {
        throw new BadRequestException({
          error: 'Opa, erro ao criar hash de senha',
          success: false,
        });
      }

      const date = new Date();

      const createPassHash = em.create(PassHash, {
        hash: generatePassHash.data ?? '',
        user: user,
        created_at: date,
        updated_at: date,
      });

      this.unitOfWork.state(createPassHash);
    });
  }
}
