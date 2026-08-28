import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get('title/check/:title')
  async verifyTitle(@Param('title') title: string) {
    return await this.service.verifyTitleTask(title);
  }
}
