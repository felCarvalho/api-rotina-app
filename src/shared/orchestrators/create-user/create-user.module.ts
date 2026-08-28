import { Module } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { AuthenticationModule } from '../../../authentication/authentication.module';
import { UserModule } from '../../../user/user.module';
import { ModuleCore } from '../../../shared/moduleCore/module.core';
import { CreateUserController } from './create-user.controller';

@Module({
  controllers: [CreateUserController],
  imports: [AuthenticationModule, ModuleCore],
  providers: [CreateUserService],
})
export class CreateUserModule {}
