import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
