import { defineEntity, p } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity/base.entity';
import { CredentialsRepository } from '../repository/credentials.repository';
import { User } from '../../user/user.entity';

export const credentialsSchema = defineEntity({
  name: 'Credentials',
  extends: BaseEntity,
  repository: () => CredentialsRepository,
  properties: {
    user: () => p.manyToOne(User),
    identifier: p.string(),
    provider: p.string(),
  },
});

export class Credentials extends credentialsSchema.class {}

credentialsSchema.setClass(Credentials);
