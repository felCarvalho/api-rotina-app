import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authencation.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { User } from '../shared/custom-decorators/user.decorators';
import type { RefreshTokenPayload } from '../shared/interface/interface';
import { type Response } from 'express';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @User() user: { identifier: string; userId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = await this.authService.login(
      user.identifier,
      user.userId,
    );

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return sessionId;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(
    @User() user: { refreshToken: string; payload: RefreshTokenPayload },
  ) {
    return await this.authService.verifyRefreshToken(
      user.refreshToken,
      user.payload,
    );
  }

  @Get('credentials/check/:identifier')
  async checkCredentials(@Param('identifier') identifier: string) {
    return await this.authService.verifyIdentifier(identifier);
  }
}
