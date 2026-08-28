import { EntityRepository } from '@mikro-orm/postgresql';
import { Credentials } from '../entity/credentials.entity';

export class CredentialsRepository extends EntityRepository<Credentials> {
  async findCredByIdentifier(identifier: string) {
    return await this.findOne({ identifier }, { populate: ['user'] });
  }

  createCred(cred: Credentials) {
    return this.create(cred, { persist: true });
  }
}
