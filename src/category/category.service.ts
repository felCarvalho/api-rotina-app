import { CategoryRepository } from './category.repository';
import { Result } from '../shared/result-pattern/result';
import { Category } from './category.entity';
import { User } from '../user/user.entity';
import { ConflictException } from '@nestjs/common';
import { Builder } from 'builder-pattern';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private async findAll(userId: string) {
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

    if (findExistsTitle) {
      return Result.err('Ops, essa titulo já existe');
    }
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
