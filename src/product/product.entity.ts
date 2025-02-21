import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MoreSubcategory } from '../moresubcategory/moresubcategory.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => MoreSubcategory, (moresubcategory) => moresubcategory.id, { onDelete: 'CASCADE' })
  moresubcategory: MoreSubcategory;
}
