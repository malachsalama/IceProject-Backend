import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Supplier } from '../entities/supplier.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetAllSuppliersDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all suppliers' }),
      ApiResponse({
        status: 200,
        description: 'Suppliers retrieved successfully',
        type: ApiResponseType<[Supplier]>,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
