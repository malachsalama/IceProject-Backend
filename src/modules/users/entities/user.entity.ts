import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user.enums';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '1a2b3c4d',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Column()
  full_name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'malach@salama.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    example: '$2b$10$...',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2025-03-29T12:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2025-03-29T12:00:00.000Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
