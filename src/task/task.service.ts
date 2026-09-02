import {
  BadRequestException,
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

  async updateTitleAndDescriptionTask(
    title: string,
    description: string,
    taskId: string,
    userId: string,
  ) {
    if (!taskId || !userId) {
      throw new BadRequestException('Id de tarefa ou usuário inválido');
    }

    if (!title.trim() && !description.trim()) {
      throw new BadRequestException('Título e descrição não podem ser vazios');
    }

    const findTask = await this.taskRepository.findTaskById(taskId);

    if (!findTask) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (findTask.user.id !== userId) {
      throw new ForbiddenException('Tarefa não encontrada');
    }

    try {
      if (title.trim()) findTask.title = title.trim();
      if (description.trim()) findTask.description = description.trim();

      await this.unitOfWork.save();
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
      findTask.deleted_at = new Date();
      await this.unitOfWork.save();
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
