import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // ყველა კატეგორიის დაბრუნება
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  // ერთი კატეგორიის პოვნა ID-ის მიხედვით
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // ახალი კატეგორიის შექმნა
  async create(category: Partial<Category>): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  // კატეგორიის განახლება (სურათის ჩანაცვლება ჩართულია)
  async update(id: number, categoryData: Partial<Category>, file?: Express.Multer.File): Promise<Category> {
    const category = await this.findOne(id);

    // ძველი სურათის წაშლა, თუ ახალი სურათი აიტვირთა
    if (file && category.image) {
      const oldImagePath = path.join(__dirname, '../../uploads', category.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedCategory = {
      ...category,
      ...categoryData,
      image: file ? file.filename : category.image, // ახალი სურათი თუ არის, დავამატოთ
    };

    await this.categoryRepository.update(id, updatedCategory);
    return this.findOne(id);
  }

  // კატეგორიის წაშლა (სურათიც წაიშლება)
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // სურათის წაშლა, თუ არსებობს
    if (category.image) {
      const imagePath = path.join(__dirname, '../../uploads', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.categoryRepository.delete(id);
  }
}
