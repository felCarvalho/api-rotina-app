import { Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('title/check/:title')
  async verifyTitle(@Param('title') title: string) {
    return await this.service.verifyTitleCategory(title);
  }
}
