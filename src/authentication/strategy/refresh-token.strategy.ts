import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from '../authencation.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayload } from '../../shared/interface/interface';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET') ?? '',
      passReqToCallback: true,
    });
  }

  validate(req: Express.Request, payload: RefreshTokenPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!refreshToken) {
      throw new UnauthorizedException('Token não encontrado');
    }

    return {
      payload,
      refreshToken,
    };
  }
}
