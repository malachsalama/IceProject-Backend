// src/users/dto/update-user.dto.ts
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.enums';

// export class UpdateUserDto extends PartialType(
//   OmitType(CreateUserDto, ['email', 'role'] as const),
// ) {}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [] as const),
) {
  @ApiProperty({
    description: 'Full name of the user (optional)',
    example: 'Jane Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    description: 'Email address of the user (optional)',
    example: 'jane@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description:
      'Password for the user account (optional, minimum 6 characters if provided)',
    example: 'newpassword123',
    required: false,
  })
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Role of the user (optional)',
    enum: UserRole,
    example: UserRole.ADMIN,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
