import { Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from '../category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}
}
