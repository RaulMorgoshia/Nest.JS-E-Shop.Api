import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Category } from '../category/category.entity';
import { MoreSubcategory } from '../moresubcategory/moresubcategory.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'CASCADE' })
  category: Category;

  @OneToMany(() => MoreSubcategory, (moresubcategory) => moresubcategory.subcategory)
  moresubcategories: MoreSubcategory[];
}
