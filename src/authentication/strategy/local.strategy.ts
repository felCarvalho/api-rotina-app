import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authencation.service';
import { UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthenticationService) {
    super({
      usernameField: 'identifier',
      passwordField: 'password',
    });
  }

  async validate(identifier: string, password: string) {
    const authResult = await this.authService.validateUser(
      identifier,
      password,
    );

    if (!authResult) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    return { identifier: authResult.identifier, userId: authResult.userId };
  }
}
