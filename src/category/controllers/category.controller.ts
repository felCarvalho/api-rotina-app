import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}
}
