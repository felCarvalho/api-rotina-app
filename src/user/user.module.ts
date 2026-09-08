import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './controllers/user.controller';
import { VerifyUserController } from './controllers/verify.controllers';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController, VerifyUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
