import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MemoryAbstract } from '../shared/redis/redis';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly memory: MemoryAbstract) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const cookies: string | undefined = req.cookies.sessionId;
    console.log('cookiesRefresh:' + cookies);

    if (!cookies) {
      throw new BadRequestException('Ops, não encontramos um token de sessão');
    }

    const findRefreshToken = await this.memory.hGetBy({
      key: `sessionId:${cookies}`,
      field: 'refreshToken',
    });

    console.log('refreshToken:' + findRefreshToken);

    if (!findRefreshToken) {
      throw new UnauthorizedException('Ops, acesso não autorizado');
    }

    req.headers.authorization = `Bearer ${findRefreshToken}`;
    next();
  }
}
