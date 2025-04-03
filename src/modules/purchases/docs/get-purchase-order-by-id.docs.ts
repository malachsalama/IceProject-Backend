import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetPurchaseOrderByIdDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a purchase order by ID' }),
      ApiResponse({
        status: 200,
        description: 'Purchase order retrieved successfully',
        type: ApiResponseType<PurchaseOrder>,
      }),
      ApiNotFoundResponse({
        description:
          'Not Found - Purchase order with the specified ID does not exist',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
