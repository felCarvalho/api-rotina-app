import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { Result } from '../shared/result-pattern/result';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string) {
    if (!id) {
      return Result.err('Ops, id de usuario invalido');
    }

    const user = await this.userRepository.findByUserId(id);

    if (!user) {
      return Result.err('Ops, não ecnontramos seu usuario');
    }

    return Result.ok(user);
  }

  async findUsername(name: string) {
    const findUsername = await this.userRepository.findName(name);

    if (findUsername) {
      return Result.err('Ops, esse nome de usuario já está em uso');
    }
  }

  createUser(user: User) {
    if (!user.name.trim()) {
      return Result.err('Nome de usuario inválido');
    }

    return this.userRepository.createUser(user);
  }
}
