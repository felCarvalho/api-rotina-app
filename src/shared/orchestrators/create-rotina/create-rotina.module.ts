import { Module } from '@nestjs/common';
import { ModuleCore } from '../../moduleCore/module.core';
import { CreateRotinaController } from './create-rotina.controller';
import { TaskModule } from '../../../task/task.module';
import { CreateRotinaService } from './create-rotina.service';
import { CategoryModule } from '../../../category/category.module';
import { UserModule } from '../../../user/user.module';
import { AuthenticationModule } from '../../../authentication/authentication.module';

@Module({
  controllers: [CreateRotinaController],
  imports: [
    TaskModule,
    CategoryModule,
    UserModule,
    ModuleCore,
    AuthenticationModule,
  ],
  providers: [CreateRotinaService],
})
export class CreateRotinaModule {}
