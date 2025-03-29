import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../types/response.type';
import { User } from '../entities/user.entity';

export const GetUserByIdDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a user by ID' }),
      ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        type: () => ApiResponseType<User>,
      }),
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ),
};
