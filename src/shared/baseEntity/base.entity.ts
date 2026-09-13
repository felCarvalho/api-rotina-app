import { defineEntity, p } from '@mikro-orm/postgresql';

export const BaseEntity = defineEntity({
  abstract: true,
  name: 'base',
  properties: {
    id: p.string().primary().defaultRaw('uuidv7()'),
    createdAt: p.datetime().defaultRaw('NOW()'),
    updatedAt: p.datetime().defaultRaw('NOW()'),
    deletedAt: p.datetime().nullable(),
  },
});
