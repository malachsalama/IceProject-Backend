import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

export const LoginDocs = {
  login: () =>
    applyDecorators(
      ApiOperation({ summary: 'Log in a user and return a JWT token' }),
      ApiResponse({
        status: 201,
        description: 'User logged in successfully',
        type: LoginResponseDto,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid credentials',
      }),
    ),
};
