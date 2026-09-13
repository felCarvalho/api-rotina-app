import { defineEntity, p } from '@mikro-orm/core';
import { User } from '../../user/user.entity';
import { PasswordHashRepository } from '../repository/pashHash.repository';

export const passHashSchema = defineEntity({
  name: 'passHash',
  repository: () => PasswordHashRepository,
  properties: {
    user: () => p.oneToOne(User).primary(),
    hash: p.string(),
    createdAt: p.datetime(),
    deletedAt: p.datetime().nullable(),
    updatedAt: p.datetime(),
  },
});

export class PassHash extends passHashSchema.class {}

passHashSchema.setClass(PassHash);
