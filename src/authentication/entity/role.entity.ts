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
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
    deletedAt: p.datetime().nullable(),
  },
});

export class Role extends roleSchema.class {}

roleSchema.setClass(Role);
