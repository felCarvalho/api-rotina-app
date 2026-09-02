import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from '../authencation.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.guard';
import { User } from '../../shared/custom-decorators/user.decorators';
import type { RefreshTokenPayload } from '../../shared/interface/interface';
import { type Response } from 'express';
import { CookiesTokensInterceptor } from '../../interceptor/cookies.interceptor';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

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

  //controller de refresh
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(CookiesTokensInterceptor)
  @Post('refresh')
  async refresh(
    @User()
    user: { payload: RefreshTokenPayload; sessionId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.verifyRefreshToken(user.payload, user.sessionId);
  }
}
