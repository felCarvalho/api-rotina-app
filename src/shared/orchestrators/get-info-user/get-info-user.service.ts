import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../../../user/user.service';
import { AuthenticationService } from '../../../authentication/authencation.service';
import { Result } from '../../../shared/result-pattern/result';

@Injectable()
export class GetInfoUserService {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async getInfoUser(userId: string, identifier: string) {
    if (!userId) {
      throw new BadRequestException('Ops, usuario inválido');
    }

    const user = await this.userService.findById(userId);

    if (!user.success) {
      throw new NotFoundException({ ...user });
    }

    const idenfitifer =
      await this.authenticationService.findCredentialsByIdentifier(identifier);

    if (!idenfitifer.success) {
      throw new NotFoundException({ ...idenfitifer });
    }

    return Result.ok({
      id: user.data.id,
      name: user.data.name,
      updatedAt: user.data.updatedAt,
      createdAt: user.data.createdAt,
      identifier: idenfitifer.data.identifier,
    });
  }
}
