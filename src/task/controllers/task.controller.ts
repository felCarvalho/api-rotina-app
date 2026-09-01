import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TaskService } from '../task.service';
import { User } from '../../shared/custom-decorators/user.decorators';
import type { AccessTokenPayload } from '../../shared/interface/interface';
import { JwtAuthGuard } from '../../authentication/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get('all/user')
  async getAllTask(@User() payload: AccessTokenPayload) {
    return this.service.findAll(payload.sub);
  }
}
