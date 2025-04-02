import { IsUUID, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePurchaseOrderItemDto } from './create-purchase-order-item.dto';

export class CreatePurchaseOrderDto {
  @ApiProperty({
    description: 'ID of the supplier',
    example: '5e6f7g8h',
  })
  @IsUUID()
  supplier_id: string;

  @ApiProperty({
    description: 'Date of the purchase order',
    example: '2025-04-01',
  })
  @IsDateString()
  order_date: string;

  @ApiProperty({
    description: 'List of items in the purchase order',
    type: [CreatePurchaseOrderItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  items: CreatePurchaseOrderItemDto[];
}
