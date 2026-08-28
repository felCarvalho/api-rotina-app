import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { CreateUserService } from './create-user.service';

@Controller('account')
export class CreateUserController {
  constructor(private readonly service: CreateUserService) {}

  @Post('create')
  async createUser(@Body() body: CreateUserDto) {
    return await this.service.createUserOrchestrator(body);
  }
}
