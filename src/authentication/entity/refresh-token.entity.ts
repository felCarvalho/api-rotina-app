import { defineEntity, p } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity/base.entity';
import { User } from '../../user/user.entity';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';

export const refreshTokenSchema = defineEntity({
  name: 'refreshToken',
  extends: BaseEntity,
  repository: () => RefreshTokenRepository,
  properties: {
    user: () => p.manyToOne(User),
    status: p.enum(['ativo', 'inativo']),
    refreshHash: p.string(),
  },
});

export class RefreshToken extends refreshTokenSchema.class {}

refreshTokenSchema.setClass(RefreshToken);
