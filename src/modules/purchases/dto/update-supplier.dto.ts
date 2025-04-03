import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplierDto {
  @ApiProperty({
    description: 'Name of the supplier',
    example: 'Tech Supplies Inc.',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Contact person’s name',
    example: 'John Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact_name?: string;

  @ApiProperty({
    description: 'Contact email of the supplier',
    example: 'john@techsupplies.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({
    description: 'Contact phone number of the supplier',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({
    description: 'Address of the supplier',
    example: 'Bishop Road, Fourth Ngong Ave, Nairobi',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
