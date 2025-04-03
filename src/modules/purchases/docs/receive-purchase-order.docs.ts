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

export const ReceivePurchaseOrderDocs = {
  receive: () =>
    applyDecorators(
      ApiOperation({ summary: 'Mark a purchase order as received' }),
      ApiResponse({
        status: 200,
        description: 'Purchase order received successfully',
        type: ApiResponseType<PurchaseOrder>,
      }),
      ApiBadRequestResponse({
        description:
          'Bad Request - Purchase order already received or cancelled',
      }),
      ApiNotFoundResponse({
        description: 'Not Found - Purchase order or product not found',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
