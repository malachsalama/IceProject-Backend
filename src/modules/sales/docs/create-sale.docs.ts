import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Sale } from '../entities/sale.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const CreateSaleDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new sale' }),
      ApiResponse({
        status: 201,
        description: 'Sale created successfully',
        type: ApiResponseType<Sale>,
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Insufficient stock or invalid product ID',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
