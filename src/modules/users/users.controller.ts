import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDocs } from './docs/create-user.docs';
import { GetAllUsersDocs } from './docs/get-all-users.docs';
import { GetUserByIdDocs } from './docs/get-user-by-id.docs';
import { UpdateUserByIdDocs } from './docs/update-user-by-id.docs';
import { DeleteUserByIdDocs } from './docs/delete-user-by-id.docs';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.enums';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can create users
  @CreateUserDocs.create()
  createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can view all users
  @GetAllUsersDocs.get()
  findAllUsers(): Promise<ApiResponse<User[]>> {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can view a user
  @GetUserByIdDocs.get()
  findUserById(@Param('id') id: string): Promise<ApiResponse<User>> {
    return this.usersService.findUserById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can update users
  @UpdateUserByIdDocs.update()
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can delete users
  @DeleteUserByIdDocs.delete()
  deleteUser(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return this.usersService.deleteUser(id);
  }
}
