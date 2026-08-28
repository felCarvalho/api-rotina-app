import { defineEntity, p } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity/base.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { TaskRepository } from './task.repository';

export const taskSchema = defineEntity({
  name: 'task',
  extends: BaseEntity,
  repository: () => TaskRepository,
  properties: {
    title: p.string().unique(),
    description: p.string(),
    status: p.enum(['concluida', 'incompleta']),
    category: () => p.manyToOne(Category),
    user: () => p.manyToOne(User),
  },
});

export class Task extends taskSchema.class {}

taskSchema.setClass(Task);
