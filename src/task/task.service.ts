import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Task } from './task.entity';
import { Builder } from 'builder-pattern';
import { Result } from '../shared/result-pattern/result';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(userId: string) {
    if (!userId) {
      return Result.err('Id de usuario inválido');
    }

    return await this.taskRepository.findAllTaskUser(userId);
  }

  async verifyTitleTask(title: string) {
    const findExistsTitle = await this.taskRepository.findTaskByTitle(title);

    if (findExistsTitle) {
      return Result.err('Ops, esse titulo já existe');
    }

    return Result.ok('Opa, titulo de tarefa não existe');
  }

  async createTasks(task: Task, user: User, category: Category) {
    const findTitleTask = await this.taskRepository.findTaskByTitle(task.title);

    if (findTitleTask) {
      return Result.err('Tarefa com o mesmo título já existe');
    }

    const createTasks = Builder<Task>()
      .category(category)
      .user(user)
      .description(task.description)
      .status(task.status)
      .title(task.title)
      .build();

    if (!createTasks.title.trim()) {
      return Result.err('Nome de usuario inválido');
    }

    if (
      !createTasks.status.includes('concluida') &&
      !createTasks.status.includes('incompleta')
    ) {
      return Result.err('Status inválido');
    }

    this.taskRepository.createTask(createTasks);
  }
}
