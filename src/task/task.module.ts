import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskController } from './controllers/task.controller';
import { VerifyTaskController } from './controllers/verify.controllers';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [MikroOrmModule.forFeature([Task]), AuthenticationModule],
  controllers: [TaskController, VerifyTaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
