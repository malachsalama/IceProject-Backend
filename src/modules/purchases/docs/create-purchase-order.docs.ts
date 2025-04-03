import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const CreatePurchaseOrderDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new purchase order' }),
      ApiResponse({
        status: 201,
        description: 'Purchase order created successfully',
        type: ApiResponseType<PurchaseOrder>,
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid data',
      }),
      ApiNotFoundResponse({
        description: 'Not Found - Supplier or product not found',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
