import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const LoginDocs = {
  login: () =>
    applyDecorators(
      ApiOperation({ summary: 'Log in a user and return a JWT token' }),
      ApiResponse({
        status: 201,
        description: 'User logged in successfully',
        type: ApiResponseType,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid credentials',
      }),
    ),
};
