import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Supplier } from '../entities/supplier.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const CreateSupplierDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new supplier' }),
      ApiResponse({
        status: 201,
        description: 'Supplier created successfully',
        type: ApiResponseType<Supplier>,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
