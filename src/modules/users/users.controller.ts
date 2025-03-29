import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from './types/response.type';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDocs } from './docs/create-user.docs';
import { GetAllUsersDocs } from './docs/get-all-users.docs';
import { GetUserByIdDocs } from './docs/get-user-by-id.docs';
import { UpdateUserByIdDocs } from './docs/update-user-by-id.docs';
import { DeleteUserByIdDocs } from './docs/delete-user-by-id.docs';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @CreateUserDocs.create()
  createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @GetAllUsersDocs.get()
  findAllUsers(): Promise<ApiResponse<User[]>> {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @GetUserByIdDocs.get()
  findUserById(@Param('id') id: string): Promise<ApiResponse<User>> {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UpdateUserByIdDocs.update()
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @DeleteUserByIdDocs.delete()
  deleteUser(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return this.usersService.deleteUser(id);
  }
}
