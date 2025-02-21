import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MoreSubcategory } from '../moresubcategory/moresubcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, MoreSubcategory])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
