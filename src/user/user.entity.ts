import { defineEntity, p } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity/base.entity';
import { UserRepository } from './user.repository';
import { UserRoles } from '../authentication/entity/userRoles.entity';

export const userSchema = defineEntity({
  name: 'user',
  extends: BaseEntity,
  repository: () => UserRepository,
  properties: {
    name: p.string(),
    userRoles: () => p.oneToMany(UserRoles).mappedBy('user'),
  },
});

export class User extends userSchema.class {}

userSchema.setClass(User);
