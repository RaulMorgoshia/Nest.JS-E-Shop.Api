import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoreSubcategory } from './moresubcategory.entity';
import { Subcategory } from '../subcategory/subcategory.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MoreSubcategoryService {
  constructor(
    @InjectRepository(MoreSubcategory)
    private moresubcategoryRepository: Repository<MoreSubcategory>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  async findAll(): Promise<MoreSubcategory[]> {
    return this.moresubcategoryRepository.find({ relations: ['subcategory'] });
  }

  async findOne(id: number): Promise<MoreSubcategory> {
    const moresubcategory = await this.moresubcategoryRepository.findOne({
      where: { id },
      relations: ['subcategory'],
    });

    if (!moresubcategory) {
      throw new NotFoundException(`MoreSubcategory with ID ${id} not found`);
    }

    return moresubcategory;
  }

  async create(moresubcategoryData: Partial<MoreSubcategory> & { subcategoryId: number; image?: string }): Promise<MoreSubcategory> {
    if (!moresubcategoryData.subcategoryId) {
      throw new NotFoundException('subcategoryId is required');
    }

    const subcategory = await this.subcategoryRepository.findOneBy({
      id: moresubcategoryData.subcategoryId,
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${moresubcategoryData.subcategoryId} not found`);
    }

    const moresubcategory = this.moresubcategoryRepository.create({
      ...moresubcategoryData,
      subcategory,
    });

    return this.moresubcategoryRepository.save(moresubcategory);
  }

  async update(id: number, moresubcategoryData: Partial<MoreSubcategory>, file?: Express.Multer.File): Promise<MoreSubcategory> {
    const moresubcategory = await this.findOne(id);

    // ძველი სურათის წაშლა, თუ ახალი სურათი აიტვირთა
    if (file && moresubcategory.image) {
      const oldImagePath = path.join(__dirname, '../../uploads', moresubcategory.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedMoreSubcategory = {
      ...moresubcategory,
      ...moresubcategoryData,
      image: file ? file.filename : moresubcategory.image,
    };

    await this.moresubcategoryRepository.update(id, updatedMoreSubcategory);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const moresubcategory = await this.findOne(id);

    // სურათის წაშლა, თუ არსებობს
    if (moresubcategory.image) {
      const imagePath = path.join(__dirname, '../../uploads', moresubcategory.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.moresubcategoryRepository.delete(id);
  }
}
