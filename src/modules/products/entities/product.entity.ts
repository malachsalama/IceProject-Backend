import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SaleItem } from '../../../modules/sales/entities/sale-item.entity';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '1a2b3c4d',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Laptop',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Stock Keeping Unit (SKU) for the product',
    example: 'LAP001',
  })
  @Column({ unique: true })
  sku: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Quantity in stock',
    example: 50,
  })
  @Column('int')
  stock: number;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
  saleItems: SaleItem[];

  @ApiProperty({
    description: 'Timestamp when the product was created',
    example: '2025-03-29T12:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the product was last updated',
    example: '2025-03-29T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
