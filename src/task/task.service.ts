import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Task } from './task.entity';
import { Builder } from 'builder-pattern';
import { Result } from '../shared/result-pattern/result';
import { UnitOfWorkAbstract } from '../shared/uniOfWork/unitOfWork';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly unitOfWork: UnitOfWorkAbstract,
  ) {}

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

  async updateTitleTask(title: string, taskId: string, userId: string) {
    if (!taskId || !userId) {
      throw new BadRequestException('Id de tarefa ou usuário inválido');
    }

    if (!title) {
      throw new BadRequestException('Título não podem ser vazios');
    }

    const titleTask = title?.trim();

    const findTask = await this.taskRepository.findTaskById(taskId);

    if (!findTask) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (findTask.user.id !== userId) {
      throw new ForbiddenException('Tarefa não encontrada');
    }

    const findAllTasksUser = await this.taskRepository.findTaskByTitle(title);

    if (findAllTasksUser) {
      throw new ConflictException('Ops, esse titulo já existe');
    }

    try {
      if (titleTask.length > 0) findTask.title = titleTask;

      await this.unitOfWork.save();
      return Result.ok('Opa, tarefa atualizada com sucesso!');
    } catch (error) {
      return Result.err('Erro ao salvar tarefa: ' + error);
    }
  }

  async updateStatusTask(
    status: 'incompleta' | 'concluida',
    taskId: string,
    userId: string,
  ) {
    if (!taskId || !userId) {
      throw new BadRequestException('Id de tarefa ou usuário inválido');
    }

    if (status !== 'incompleta' && status !== 'concluida') {
      throw new BadRequestException('Status inválido');
    }

    const findTask = await this.taskRepository.findTaskById(taskId);

    if (!findTask) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (findTask.user.id !== userId) {
      throw new ForbiddenException('Tarefa não encontrada');
    }

    try {
      if (status.trim()) findTask.status = status;

      await this.unitOfWork.save();

      return Result.ok('Opa, status de tarefa atualizado!');
    } catch (error) {
      return Result.err('Erro ao atualizar tarefa: ' + error);
    }
  }

  async deleteTask(taskId: string, userId: string) {
    if (!taskId || !userId) {
      throw new BadRequestException('Id de tarefa ou usuário inválido');
    }

    const findTask = await this.taskRepository.findTaskById(taskId);

    if (!findTask) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (findTask.user.id !== userId) {
      throw new ForbiddenException('Tarefa não encontrada');
    }

    try {
      findTask.deletedAt = new Date();
      await this.unitOfWork.save();

      return Result.ok('Tarefa deletada com sucesso');
    } catch (error) {
      return Result.err('Erro ao deletar tarefa: ' + error);
    }
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
