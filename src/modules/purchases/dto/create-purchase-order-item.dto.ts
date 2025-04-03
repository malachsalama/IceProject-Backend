import { IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseOrderItemDto {
  @ApiProperty({
    description: 'ID of the product to purchase',
    example: '1a2b3c4d',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Quantity of the product to purchase',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 900.0,
  })
  @IsNumber()
  @Min(0)
  unit_price: number;
}
