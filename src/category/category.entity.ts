import { defineEntity, p } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity/base.entity';
import { User } from '../user/user.entity';
import { CategoryRepository } from './category.repository';

export const categorySchema = defineEntity({
  name: 'category',
  extends: BaseEntity,
  repository: () => CategoryRepository,
  properties: {
    title: p.string().unique(),
    description: p.string(),
    user: () => p.manyToOne(User),
  },
});

export class Category extends categorySchema.class {}

categorySchema.setClass(Category);
