import { Module } from '@nestjs/common';
import { Credentials } from './entity/credentials.entity';
import { PassHash } from './entity/passHash.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authencation.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ModuleCore } from '../shared/moduleCore/module.core';
import { Permissions } from './entity/permissions.entity';
import { Role } from './entity/role.entity';
import { RolesPermissions } from './entity/rolesPermissions.entity';
import { UserRoles } from './entity/userRoles.entity';
import { User } from '../user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { TokenStrategy } from './strategy/token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Credentials,
      PassHash,
      RefreshToken,
      Permissions,
      Role,
      RolesPermissions,
      UserRoles,
      User,
    ]),
    PassportModule,
    ModuleCore,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    TokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthenticationService, PassportModule, TokenStrategy],
})
export class AuthenticationModule {}
