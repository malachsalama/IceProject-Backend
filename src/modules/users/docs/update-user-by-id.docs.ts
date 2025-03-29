import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../types/response.type';
import { User } from '../entities/user.entity';

export const UpdateUserByIdDocs = {
  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update a user by ID' }),
      ApiResponse({
        status: 200,
        description: 'User updated successfully',
        type: () => ApiResponseType<User>,
      }),
      ApiNotFoundResponse({
        description: 'User not found',
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid or missing data',
      }),
    ),
};
