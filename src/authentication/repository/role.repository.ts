import { EntityRepository } from '@mikro-orm/postgresql';
import { Role } from '../entity/role.entity';

export class RoleRepository extends EntityRepository<Role> {
  async findRoleBySlug(slug: string) {
    return await this.findOne({ slug });
  }

  createRole(role: Role) {
    this.create(role, { persist: true });
  }
}
