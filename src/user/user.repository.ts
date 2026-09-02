import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../user/user.entity';

export class UserRepository extends EntityRepository<User> {
  async findByUserId(id: string) {
    return await this.findOne({ id }, { populate: ['userRoles.role'] });
  }

  async findName(name: string) {
    return await this.findOne({ name });
  }

  createUser(user: User) {
    return this.create(user, { persist: true });
  }
}
