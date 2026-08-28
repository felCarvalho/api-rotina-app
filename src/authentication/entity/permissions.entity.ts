import { defineEntity, p } from '@mikro-orm/core';
import { PermissionsRepository } from '../repository/permissions.repository';

export const permissionsSchema = defineEntity({
  name: 'permissions',
  repository: () => PermissionsRepository,
  properties: {
    name: p.string(),
    slug: p.string().unique().primary(),
    created_at: p.datetime(),
    updated_at: p.datetime(),
    deleted_at: p.datetime().nullable(),
  },
});

export class Permissions extends permissionsSchema.class {}

permissionsSchema.setClass(Permissions);
