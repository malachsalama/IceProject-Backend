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

export const UpdateSupplierDocs = {
  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update a supplier by ID' }),
      ApiResponse({
        status: 200,
        description: 'Supplier updated successfully',
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
