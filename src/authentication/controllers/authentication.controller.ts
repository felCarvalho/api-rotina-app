import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Res,
  UseInterceptors,
  Get,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../authencation.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.guard';
import { User } from '../../shared/custom-decorators/user.decorators';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../shared/interface/interface';
import type { Response, Request } from 'express';
import { CookiesTokensInterceptor } from '../../interceptor/cookies.interceptor';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly service: AuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  //controller de login
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(CookiesTokensInterceptor)
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @User() user: { identifier: string; userId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.login(user.identifier, user.userId);
  }

  //controller de logout
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(
    @User() user: AccessTokenPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('sessionId');
    const { sessionId } = req.signedCookies;
    return await this.service.logout(sessionId, user.sub);
  }

  //controller de refresh
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(CookiesTokensInterceptor)
  @Post('refresh')
  async refresh(
    @User()
    user: {
      payload: RefreshTokenPayload;
      sessionId: string;
    },
  ) {
    return await this.service.verifyRefreshToken(user.payload, user.sessionId);
  }
}
