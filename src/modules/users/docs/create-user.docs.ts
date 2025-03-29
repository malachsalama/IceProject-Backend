import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../types/response.type';
import { User } from '../entities/user.entity';

export const CreateUserDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new user' }),
      ApiResponse({
        status: 201,
        description: 'User created successfully',
        type: () => ApiResponseType<User>,
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid or missing data',
      }),
    ),
};
