import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const DeleteSupplierDocs = {
  delete: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a supplier by ID' }),
      ApiResponse({
        status: 200,
        description: 'Supplier deleted successfully',
        type: ApiResponseType<boolean>,
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
