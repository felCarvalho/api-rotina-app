import { Controller, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('username/check/:name')
  async verifyUsername(@Param('name') name: string) {
    return await this.service.findUsername(name);
  }
}
