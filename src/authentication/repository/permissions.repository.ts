import { EntityRepository } from '@mikro-orm/postgresql';
import { Permissions } from '../entity/permissions.entity';

export class PermissionsRepository extends EntityRepository<Permissions> {
  async findPermissionsBySlug(slug: string) {
    return await this.findOne({ slug });
  }

  createPermissions(permissions: Permissions) {
    this.create(permissions, { persist: true });
  }
}
