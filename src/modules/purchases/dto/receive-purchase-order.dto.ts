import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReceivePurchaseOrderDto {
  @ApiProperty({
    description: 'Date the purchase order was received',
    example: '2025-04-05',
  })
  @IsDateString()
  received_date: string;
}
