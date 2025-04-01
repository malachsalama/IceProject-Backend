import { IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleItemDto {
  @ApiProperty({
    description: 'ID of the product to sell',
    example: '1a2b3c4d',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    description: 'Quantity of the product to sell',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
