import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { MoreSubcategoryService } from './moresubcategory.service';
import { MoreSubcategory } from './moresubcategory.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('moresubcategories')
export class MoreSubcategoryController {
  constructor(private readonly moresubcategoryService: MoreSubcategoryService) {}

  @Get()
  findAll(): Promise<MoreSubcategory[]> {
    return this.moresubcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<MoreSubcategory> {
    return this.moresubcategoryService.findOne(id);
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
  create(@UploadedFile() file: Express.Multer.File, @Body() moresubcategory: { name: string; subcategoryId: number }): Promise<MoreSubcategory> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.moresubcategoryService.create({ ...moresubcategory, image: file.filename });
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
  async update(@Param('id') id: number, @UploadedFile() file: Express.Multer.File, @Body() moresubcategory: Partial<MoreSubcategory>): Promise<MoreSubcategory> {
    return this.moresubcategoryService.update(id, moresubcategory, file);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.moresubcategoryService.remove(id);
  }
}
