import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsAlphanumeric,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Stock Keeping Unit (SKU) for the product',
    example: 'LAP-001',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Quantity in stock',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
