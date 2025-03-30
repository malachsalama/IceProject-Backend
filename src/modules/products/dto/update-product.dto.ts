import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsAlphanumeric,
} from 'class-validator';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, [] as const),
) {
  @ApiProperty({
    description: 'Name of the product (optional)',
    example: 'Updated Laptop',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Stock Keeping Unit (SKU) for the product (optional)',
    example: 'LAP002',
    required: false,
  })
  @IsAlphanumeric()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Price of the product (optional)',
    example: 1099.99,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Quantity in stock (optional)',
    example: 75,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
