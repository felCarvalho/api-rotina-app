import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UnitOfWorkAbstract } from '../../../shared/uniOfWork/unitOfWork';
import { TaskService } from '../../../task/task.service';
import { CategoryService } from '../../../category/category.service';
import { CreateRotinaDto } from './create-rotina.dto';
import { Result } from '../../../shared/result-pattern/result';
import { EntityManager } from '@mikro-orm/postgresql';
import { Task } from '../../../task/task.entity';
import { Category } from '../../../category/category.entity';
import { Builder } from 'builder-pattern';
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

      const createCategoryBuilder = Builder<Category>()
        .description(createRotinaDto.descriptionsCategory)
        .title(createRotinaDto.titleCategory)
        .build();

      const createTaskBuilder = Builder<Task>()
        .description(createRotinaDto.descriptionTask)
        .status('incompleta')
        .title(createRotinaDto.titleTask)
        .build();

      const createCategory = em.create(Category, {
        ...createCategoryBuilder,
        user: findUserExists,
      });

      this.unitOfWork.state(createCategory);

      const createTask = em.create(Task, {
        ...createTaskBuilder,
        user: findUserExists,
        category: createCategory,
      });

      this.unitOfWork.state(createTask);

      try {
        await this.unitOfWork.commit();

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
