import { EntityRepository } from '@mikro-orm/postgresql';
import { Task } from '../task/task.entity';

export class TaskRepository extends EntityRepository<Task> {
  async findAllTaskUser(user_id: string) {
    return await this.findAll({ where: { user: user_id }, populate: ['user'] });
  }

  async findTaskById(id: string) {
    return await this.findOne({ id }, { populate: ['user'] });
  }

  async findTaskByTitle(title: string) {
    return await this.findOne({ title });
  }

  async findAllTasksCategory(category_id: string) {
    return await this.findAll({
      where: { category: category_id },
      populate: ['category'],
    });
  }

  createTask(task: Task) {
    return this.create(task);
  }
}
