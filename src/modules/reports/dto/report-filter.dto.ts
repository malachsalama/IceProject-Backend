import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReportFilterDto {
  @ApiProperty({
    description: 'Start date for the report (YYYY-MM-DD)',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    description: 'End date for the report (YYYY-MM-DD)',
    example: '2025-04-05',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
