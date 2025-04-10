import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../../shared/types/response.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(newUser);
    return new ApiResponse<User>({
      message: 'User created successfully',
      data: savedUser,
    });
  }

  async findAllUsers(): Promise<ApiResponse<User[]>> {
    const users = await this.usersRepository.find();
    return new ApiResponse<User[]>({
      message:
        users.length > 0 ? 'Users retrieved successfully' : 'No users found',
      data: users,
    });
  }

  async findUserById(id: string): Promise<ApiResponse<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return new ApiResponse<User>({
      message: 'User retrieved successfully',
      data: user,
    });
  }

  async findUserByEmail(email: string): Promise<ApiResponse<User>> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return new ApiResponse<User>({
      message: 'User retrieved successfully',
      data: user,
    });
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    const userResponse = await this.findUserById(id);
    const user = userResponse.data;

    // Hash the password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    return new ApiResponse<User>({
      message: 'User updated successfully',
      data: updatedUser,
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new ApiResponse<boolean>({
      message: 'User deleted successfully',
      data: true,
    });
  }
}
