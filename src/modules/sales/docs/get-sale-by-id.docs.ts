import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Sale } from '../entities/sale.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetSaleByIdDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a sale by ID' }),
      ApiResponse({
        status: 200,
        description: 'Sale retrieved successfully',
        type: ApiResponseType<Sale>,
      }),
      ApiNotFoundResponse({
        description: 'Not Found - Sale with the specified ID does not exist',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
