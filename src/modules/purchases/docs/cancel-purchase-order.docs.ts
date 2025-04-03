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

export const CancelPurchaseOrderDocs = {
  cancel: () =>
    applyDecorators(
      ApiOperation({ summary: 'Cancel a purchase order' }),
      ApiResponse({
        status: 200,
        description: 'Purchase order cancelled successfully',
        type: ApiResponseType<PurchaseOrder>,
      }),
      ApiBadRequestResponse({
        description:
          'Bad Request - Purchase order already received or cancelled',
      }),
      ApiNotFoundResponse({
        description: 'Not Found - Purchase order not found',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
