import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';
import { User } from '../entities/user.entity';

export const GetAllUsersDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all users' }),
      ApiResponse({
        status: 200,
        description: 'Users retrieved successfully',
        type: () => ApiResponseType<User[]>,
      }),
    ),
};
