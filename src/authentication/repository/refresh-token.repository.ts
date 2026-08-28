import { RefreshToken } from '../entity/refresh-token.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class RefreshTokenRepository extends EntityRepository<RefreshToken> {
  async findByRefreshTokenId(id: string) {
    return this.findOne({ id });
  }

  createRefreshToken(refreshToken: RefreshToken) {
    return this.create(refreshToken);
  }
}
