import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Category } from '../category/category.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Subcategory[]> {
    return this.subcategoryRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} not found`);
    }

    return subcategory;
  }

  async create(subcategoryData: Partial<Subcategory> & { categoryId: number; image?: string }): Promise<Subcategory> {
    if (!subcategoryData.categoryId) {
      throw new NotFoundException('categoryId is required');
    }

    const category = await this.categoryRepository.findOneBy({
      id: subcategoryData.categoryId,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${subcategoryData.categoryId} not found`);
    }

    const subcategory = this.subcategoryRepository.create({
      ...subcategoryData,
      category,
    });

    return this.subcategoryRepository.save(subcategory);
  }

  async update(id: number, subcategoryData: Partial<Subcategory>, file?: Express.Multer.File): Promise<Subcategory> {
    const subcategory = await this.findOne(id);

    // ძველი სურათის წაშლა, თუ ახალი სურათი აიტვირთა
    if (file && subcategory.image) {
      const oldImagePath = path.join(__dirname, '../../uploads', subcategory.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedSubcategory = {
      ...subcategory,
      ...subcategoryData,
      image: file ? file.filename : subcategory.image,
    };

    await this.subcategoryRepository.update(id, updatedSubcategory);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const subcategory = await this.findOne(id);

    // სურათის წაშლა, თუ არსებობს
    if (subcategory.image) {
      const imagePath = path.join(__dirname, '../../uploads', subcategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.subcategoryRepository.delete(id);
  }
}
