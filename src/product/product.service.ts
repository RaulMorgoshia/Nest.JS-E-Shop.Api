import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { MoreSubcategory } from '../moresubcategory/moresubcategory.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(MoreSubcategory)
    private moresubcategoryRepository: Repository<MoreSubcategory>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['moresubcategory'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['moresubcategory'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(productData: Omit<Partial<Product>, 'moresubcategory'> & { moresubcategoryId: number }): Promise<Product> {
    if (!productData.moresubcategoryId) {
      throw new NotFoundException('moresubcategoryId is required');
    }

    const moresubcategory = await this.moresubcategoryRepository.findOneBy({
      id: productData.moresubcategoryId,
    });

    if (!moresubcategory) {
      throw new NotFoundException(`MoreSubcategory with ID ${productData.moresubcategoryId} not found`);
    }

    const product = this.productRepository.create({
      ...productData,
      moresubcategory,
    });

    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>, file?: Express.Multer.File): Promise<Product> {
    const product = await this.findOne(id);

    // ძველი სურათის წაშლა, თუ ახალი სურათი აიტვირთა
    if (file && product.image) {
      const oldImagePath = path.join(__dirname, '../../uploads', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedProduct = {
      ...product,
      ...productData,
      image: file ? file.filename : product.image,
    };

    await this.productRepository.update(id, updatedProduct);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    // პროდუქტის წაშლისას სურათიც უნდა წაიშალოს
    if (product.image) {
      const imagePath = path.join(__dirname, '../../uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.productRepository.delete(id);
  }
}
