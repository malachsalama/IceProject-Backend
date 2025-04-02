import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Name of the supplier',
    example: 'Tech Supplies Inc.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Contact person’s name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  contact_name: string;

  @ApiProperty({
    description: 'Contact email of the supplier',
    example: 'john@techsupplies.com',
  })
  @IsEmail()
  contact_email: string;

  @ApiProperty({
    description: 'Contact phone number of the supplier',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  contact_phone: string;

  @ApiProperty({
    description: 'Address of the supplier',
    example: 'Fourth Ngong Ave, Nairobi',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
