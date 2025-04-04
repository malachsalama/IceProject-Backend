import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { InventoryAdjustment } from '../entities/inventory-adjustment.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetProductInventoryHistoryDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get inventory history for a product' }),
      ApiResponse({
        status: 200,
        description: 'Inventory history retrieved successfully',
        type: ApiResponseType<[InventoryAdjustment]>,
      }),
      ApiNotFoundResponse({
        description: 'Not Found - Product with the specified ID does not exist',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
