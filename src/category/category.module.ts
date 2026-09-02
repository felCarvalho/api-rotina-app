import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from './category.entity';
import { VerfiyCategoryController } from './controllers/verify.controllers';

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [VerfiyCategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
