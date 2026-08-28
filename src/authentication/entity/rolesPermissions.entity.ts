import { defineEntity, p } from '@mikro-orm/core';
import { Role } from './role.entity';
import { Permissions } from './permissions.entity';
import { BaseEntity } from '../../shared/baseEntity/base.entity';

export const rolesPermissionsSchema = defineEntity({
  name: 'role_permissions',
  extends: BaseEntity,
  properties: {
    role: () => p.manyToOne(Role).inversedBy('rolePermissions'),
    permission: () => p.manyToOne(Permissions),
  },
});

export class RolesPermissions extends rolesPermissionsSchema.class {}

rolesPermissionsSchema.setClass(RolesPermissions);
