import { defineEntity, p } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity/base.entity';
import { User } from '../../user/user.entity';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';

export const refreshTokenSchema = defineEntity({
  name: 'refreshToken',
  repository: () => RefreshTokenRepository,
  properties: {
    id: p.string().primary(),
    user: () => p.manyToOne(User),
    status: p.enum(['ativo', 'inativo']),
    refreshHash: p.string(),
    created_at: p.datetime().defaultRaw('NOW()'),
    updated_at: p.datetime().defaultRaw('NOW()'),
    deleted_at: p.datetime().nullable(),
  },
});

export class RefreshToken extends refreshTokenSchema.class {}

refreshTokenSchema.setClass(RefreshToken);
