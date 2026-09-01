import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TaskService } from '../task.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('verify/task')
export class VerifyController {
  constructor(private readonly service: TaskService) {}

  @Get('title/check/:title')
  async verifyTitle(@Param('title') title: string) {
    return await this.service.verifyTitleTask(title);
  }
}
