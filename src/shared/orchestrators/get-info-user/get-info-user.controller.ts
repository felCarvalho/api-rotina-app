import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetInfoUserService } from './get-info-user.service';
import { User } from '../../../shared/custom-decorators/user.decorators';
import type { AccessTokenPayload } from '../../../shared/interface/interface';
import { JwtAuthGuard } from '../../../authentication/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('info/user')
export class GetInfoUserController {
  constructor(private readonly service: GetInfoUserService) {}

  @Get()
  async getInfo(@User() user: AccessTokenPayload) {
    return this.service.getInfoUser(user.sub, user.identifier);
  }
}
