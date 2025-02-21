import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { Subcategory } from './subcategory.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Get()
  findAll(): Promise<Subcategory[]> {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Subcategory> {
    return this.subcategoryService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  create(@UploadedFile() file: Express.Multer.File, @Body() subcategory: { name: string; categoryId: number }): Promise<Subcategory> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.subcategoryService.create({ ...subcategory, image: file.filename });
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${Date.now()}${fileExt}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async update(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Body() subcategory: Partial<Subcategory>): Promise<Subcategory> {
    return this.subcategoryService.update(id, subcategory, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.subcategoryService.remove(id);
  }
}
