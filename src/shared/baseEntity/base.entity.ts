import { defineEntity, p } from '@mikro-orm/postgresql';

export const BaseEntity = defineEntity({
  abstract: true,
  name: 'base',
  properties: {
    id: p.string().primary().defaultRaw('uuidv7()'),
    created_at: p.datetime().defaultRaw('NOW()'),
    updated_at: p.datetime().defaultRaw('NOW()'),
    deleted_at: p.datetime().nullable(),
  },
});
