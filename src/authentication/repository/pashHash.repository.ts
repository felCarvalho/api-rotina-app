import { EntityRepository } from '@mikro-orm/postgresql';
import { PassHash } from '../entity/passHash.entity';

export class PasswordHashRepository extends EntityRepository<PassHash> {
  async findPassHashById(id: string) {
    return await this.findOne({ user: { id } });
  }

  async findPassHash(hash: string) {
    return await this.findOne({ hash });
  }

  createPassHash(passHash: PassHash) {
    return this.create(passHash, { persist: true });
  }
}
