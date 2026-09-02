import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class CookiesTokensInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        console.log(value, 'interceptor');
        const res = context.switchToHttp().getResponse<Response>();
        res.cookie('sessionId', value, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        });
      }),
    );
  }
}
