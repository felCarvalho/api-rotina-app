import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../../../authentication/authentication.module';
import { UserModule } from '../../../user/user.module';
import { GetInfoUserController } from './get-info-user.controller';
import { GetInfoUserService } from './get-info-user.service';

@Module({
  imports: [AuthenticationModule, UserModule],
  providers: [GetInfoUserService],
  controllers: [GetInfoUserController],
})
export class GetInfoUserModule {}
