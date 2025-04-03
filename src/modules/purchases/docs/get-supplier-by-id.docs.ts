import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Supplier } from '../entities/supplier.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetSupplierByIdDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a supplier by ID' }),
      ApiResponse({
        status: 200,
        description: 'Supplier retrieved successfully',
        type: ApiResponseType<Supplier>,
      }),
      ApiNotFoundResponse({
        description:
          'Not Found - Supplier with the specified ID does not exist',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
