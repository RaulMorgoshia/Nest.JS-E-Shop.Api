import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoreSubcategory } from './moresubcategory.entity';
import { MoreSubcategoryService } from './moresubcategory.service';
import { MoreSubcategoryController } from './moresubcategory.controller';
import { Subcategory } from '../subcategory/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoreSubcategory, Subcategory])],
  providers: [MoreSubcategoryService],
  controllers: [MoreSubcategoryController],
})
export class MoreSubcategoryModule {}
