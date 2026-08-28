import { defineEntity, p } from '@mikro-orm/core';
import { Role } from '../entity/role.entity';
import { User } from '../../user/user.entity';
import { BaseEntity } from '../../shared/baseEntity/base.entity';

export const userRolesSchema = defineEntity({
  name: 'user_roles',
  extends: BaseEntity,
  properties: {
    role: () => p.manyToOne(Role).primary(),
    user: () => p.manyToOne(User).primary().inversedBy('userRoles'),
  },
});

export class UserRoles extends userRolesSchema.class {}

userRolesSchema.setClass(UserRoles);
