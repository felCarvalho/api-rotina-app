import { defineEntity, p } from '@mikro-orm/core';
import { RoleRepository } from '../repository/role.repository';
import { RolesPermissions } from './rolesPermissions.entity';

export const roleSchema = defineEntity({
  name: 'Role',
  repository: () => RoleRepository,
  properties: {
    rolePermissions: () => p.oneToMany(RolesPermissions).mappedBy('role'),
    name: p.string(),
    slug: p.string().primary(),
    created_at: p.datetime(),
    updated_at: p.datetime(),
    deleted_at: p.datetime().nullable(),
  },
});

export class Role extends roleSchema.class {}

roleSchema.setClass(Role);
