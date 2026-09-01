import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('verify/category')
export class VerfiyController {
  constructor(private readonly service: CategoryService) {}

  @Get('title/check/:title')
  async verifyTitle(@Param('title') title: string) {
    return await this.service.verifyTitleCategory(title);
  }
}
