import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subcategory } from '../subcategory/subcategory.entity';

@Entity()
export class MoreSubcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.id, { onDelete: 'CASCADE' })
  subcategory: Subcategory;
}
