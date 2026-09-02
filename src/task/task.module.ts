import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskController } from './controllers/task.controller';
import { VerifyTaskController } from './controllers/verify.controllers';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ModuleCore } from '../shared/moduleCore/module.core';

@Module({
  imports: [
    MikroOrmModule.forFeature([Task]),
    AuthenticationModule,
    ModuleCore,
  ],
  controllers: [TaskController, VerifyTaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
