import { defineEntity, p } from '@mikro-orm/core';
import { PermissionsRepository } from '../repository/permissions.repository';

export const permissionsSchema = defineEntity({
  name: 'permissions',
  repository: () => PermissionsRepository,
  properties: {
    name: p.string(),
    slug: p.string().unique().primary(),
    createdAt: p.datetime(),
    updatedAt: p.datetime(),
    deletedAt: p.datetime().nullable(),
  },
});

export class Permissions extends permissionsSchema.class {}

permissionsSchema.setClass(Permissions);
