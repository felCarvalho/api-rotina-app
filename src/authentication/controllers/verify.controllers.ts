import { Controller, Param, Get } from '@nestjs/common';
import { AuthenticationService } from '../authencation.service';

@Controller('verify')
export class VerifyControllers {
  constructor(private readonly service: AuthenticationService) {}

  //controllers de verificação do usuário
  @Get('credentials/check/:identifier')
  async checkCredentials(@Param('identifier') identifier: string) {
    return await this.service.verifyIdentifier(identifier);
  }
}
