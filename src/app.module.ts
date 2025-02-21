import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true, // რომ ყველა მოდულში ხელმისაწვდომი იყოს
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Category, Subcategory, MoreSubcategory, Product],
        synchronize: configService.get<boolean>('DB_SYNC') === true, // production-ში false
      }),
    }),
    CategoryModule,
    SubcategoryModule,
    MoreSubcategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
