import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateRotinaDto } from './create-rotina.dto';
import { CreateRotinaService } from './create-rotina.service';
import { User } from '../../../shared/custom-decorators/user.decorators';

@Controller('task')
export class CreateRotinaController {
  constructor(private readonly service: CreateRotinaService) {}

  @Post('create')
  async createRotina(
    @Body() body: CreateRotinaDto,
    @User() user: { sub: string },
  ) {
    return await this.service.createRotina({ ...body, userId: user.sub });
  }
}
