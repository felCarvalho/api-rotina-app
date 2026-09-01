import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MemoryAbstract } from '../shared/redis/redis';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly memory: MemoryAbstract) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const cookies: string | undefined = req.cookies.sessionId;

    if (!cookies) {
      throw new BadRequestException('Ops, não encontramos um token de sessão');
    }

    const findAccessToken = await this.memory.hGetBy({
      key: `sessionId:${cookies}`,
      field: 'accessToken',
    });

    if (!findAccessToken) {
      throw new UnauthorizedException('Ops, acesso não autorizado');
    }

    req.headers.authorization = `Bearer ${findAccessToken}`;
    next();
  }
}
