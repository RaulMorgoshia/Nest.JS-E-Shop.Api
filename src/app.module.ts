import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';
import { Subcategory } from './subcategory/subcategory.entity';
import { MoreSubcategory } from './moresubcategory/moresubcategory.entity';
import { Product } from './product/product.entity';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { MoreSubcategoryModule } from './moresubcategory/moresubcategory.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root', // Change this as per your MySQL user
      password: '', // Change this as per your MySQL password
      database: 'nest_db', // Ensure this database exists
      entities: [Category, Subcategory, MoreSubcategory, Product],
      synchronize: true, // Set to false in production
    }),
    CategoryModule,
    SubcategoryModule,
    MoreSubcategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
