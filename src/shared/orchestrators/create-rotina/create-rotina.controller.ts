import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CreateRotinaDto } from './create-rotina.dto';
import { CreateRotinaService } from './create-rotina.service';
import { User } from '../../custom-decorators/user.decorators';
import { JwtAuthGuard } from '../../../authentication/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class CreateRotinaController {
  constructor(private readonly service: CreateRotinaService) {}

  @Post('create')
  async createRotina(
    @Body() body: CreateRotinaDto,
    @User() user: { sub: string },
  ) {
    console.log(user.sub + 'user');
    return await this.service.createRotina({ ...body, userId: user.sub });
  }
}
