import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../types/response.type';

export const DeleteUserByIdDocs = {
  delete: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a user by ID' }),
      ApiResponse({
        status: 200,
        description: 'User deleted successfully',
        type: () => ApiResponseType<boolean>,
      }),
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ),
};
