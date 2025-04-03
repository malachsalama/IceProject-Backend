import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetAllPurchaseOrdersDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all purchase orders' }),
      ApiResponse({
        status: 200,
        description: 'Purchase orders retrieved successfully',
        type: ApiResponseType<[PurchaseOrder]>,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
