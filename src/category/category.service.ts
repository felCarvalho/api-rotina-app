import { CategoryRepository } from './category.repository';
import { Result } from '../shared/result-pattern/result';
import { Category } from './category.entity';
import { User } from '../user/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(userId: string) {
    if (!userId) {
      return Result.err('Id de usuario inválido');
    }

    return await this.categoryRepository.findAllCategoryUser(userId);
  }

  async findCategoryById(id: string) {
    if (!id.trim()) {
      return Result.err('id da categoria inválido');
    }

    return await this.categoryRepository.findCategoryById(id);
  }

  async verifyTitleCategory(title: string) {
    const findExistsTitle =
      await this.categoryRepository.findCategoryByTitle(title);

    console.log(findExistsTitle + 'category');

    if (findExistsTitle) {
      return Result.err('Ops, essa titulo já existe');
    }

    return Result.ok('Opa, titulo de categoria não existe');
  }

  public async createCategory(user: User, category: Category) {
    const findCategoryTitle = await this.categoryRepository.findCategoryByTitle(
      category.title,
    );

    if (findCategoryTitle) {
      throw new ConflictException({
        error: 'Ops, esse titulo já existe',
        success: false,
      });
    }

    if (!category.title.trim()) {
      return Result.err('Titulo inválido');
    }

    if (!category.user.id) {
      return Result.err('Id de usuario inválido');
    }

    return this.categoryRepository.createCategory(category);
  }
}
