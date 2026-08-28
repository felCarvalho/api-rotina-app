import { defineEntity, p } from '@mikro-orm/core';
import { User } from '../../user/user.entity';
import { PasswordHashRepository } from '../repository/pashHash.repository';

export const passHashSchema = defineEntity({
  name: 'passHash',
  repository: () => PasswordHashRepository,
  properties: {
    user: () => p.oneToOne(User).primary(),
    hash: p.string(),
    created_at: p.datetime(),
    deleted_at: p.datetime().nullable(),
    updated_at: p.datetime(),
  },
});

export class PassHash extends passHashSchema.class {}

passHashSchema.setClass(PassHash);
