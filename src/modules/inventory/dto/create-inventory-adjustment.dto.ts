import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  IsString,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryAdjustmentDto {
  @ApiProperty({
    description: 'ID of the product to adjust',
    example: '1a2b3c4d',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Quantity to adjust',
    example: 5,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Type of adjustment',
    example: 'increase',
    enum: ['increase', 'decrease'],
  })
  @IsString()
  @IsIn(['increase', 'decrease'])
  adjustment_type: string;

  @ApiProperty({
    description: 'Reason for the adjustment',
    example: 'damaged',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
