import { EntityRepository } from '@mikro-orm/postgresql';
import { Category } from './category.entity';

export class CategoryRepository extends EntityRepository<Category> {
  async findAllCategoryUser(user_id: string) {
    return await this.findAll({ where: { user: user_id }, populate: ['user'] });
  }

  async findCategoryById(id: string) {
    return await this.findOne({ id }, { populate: ['user'] });
  }

  async findCategoryByTitle(title: string) {
    return await this.findOne({ title });
  }

  createCategory(category: Category) {
    this.create(category);
  }
}
