import { Controller, Get, Param, Patch, UseGuards, Body } from '@nestjs/common';
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

  @Patch('update/title/description/:taskId')
  async updateTitleAndDescriptionTask(
    @Body() body: { title: string; description: string },
    @User() user: AccessTokenPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.service.updateTitleAndDescriptionTask(
      body.title,
      body.description,
      taskId,
      user.sub,
    );
  }

  @Patch('update/status/:taskId')
  async updateStatusTask(
    @Body() body: { status: 'incompleta' | 'concluida' },
    @User() user: AccessTokenPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.service.updateStatusTask(body.status, taskId, user.sub);
  }
}
