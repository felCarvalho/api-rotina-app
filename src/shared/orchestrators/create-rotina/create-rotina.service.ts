import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UnitOfWorkAbstract } from '../../uniOfWork/unitOfWork';
import { TaskService } from '../../../task/task.service';
import { CategoryService } from '../../../category/category.service';
import { CreateRotinaDto } from './create-rotina.dto';
import { Result } from '../../result-pattern/result';
import { EntityManager } from '@mikro-orm/postgresql';
import { Task } from '../../../task/task.entity';
import { Category } from '../../../category/category.entity';
import { UserService } from '../../../user/user.service';

@Injectable()
export class CreateRotinaService {
  constructor(
    private readonly taskService: TaskService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly unitOfWork: UnitOfWorkAbstract,
  ) {}

  async createRotina(createRotinaDto: CreateRotinaDto) {
    if (!createRotinaDto.titleTask.trim()) {
      return Result.err('Ops, titulo de tarefa inválido');
    }

    if (!createRotinaDto.titleCategory.trim()) {
      return Result.err('Ops, titulo de categoria inválido');
    }

    return await this.unitOfWork.transaction(async (em: EntityManager) => {
      const findUserExists = await this.userService.findById(
        createRotinaDto.userId,
      );

      if (!findUserExists) {
        throw new BadRequestException({
          error: 'Ops, usuario não encontrado',
          success: false,
        });
      }

      const findExistsTitleCategory =
        await this.categoryService.verifyTitleCategory(
          createRotinaDto.titleCategory,
        );

      if (!findExistsTitleCategory.success) {
        throw new ConflictException(findExistsTitleCategory.error);
      }

      const descriptionCategoy = createRotinaDto.descriptionCategory.trim()
        ? createRotinaDto.descriptionCategory.trim()
        : null;

      const createCategory = em.create(Category, {
        title: createRotinaDto.titleCategory,
        description: descriptionCategoy,
        user: findUserExists,
      });

      this.unitOfWork.state(createCategory);

      const findExistsTitleTask = await this.taskService.verifyTitleTask(
        createRotinaDto.titleTask,
      );

      if (!findExistsTitleTask.success) {
        throw new ConflictException(findExistsTitleTask.error);
      }

      const descriptionTask = createRotinaDto.descriptionTask.trim()
        ? createRotinaDto.descriptionTask.trim()
        : null;

      const createTask = em.create(Task, {
        title: createRotinaDto.titleTask,
        description: descriptionTask,
        status: 'incompleta',
        user: findUserExists,
        category: createCategory,
      });

      this.unitOfWork.state(createTask);

      try {
        return Result.ok('Opa, tarefa criada com sucesso');
      } catch (e: any) {
        throw new InternalServerErrorException({
          error: `Ops, tivemos uns problemas ao criar sua tarefa, erro: ${e}`,
          success: false,
        });
      }
    });
  }
}
