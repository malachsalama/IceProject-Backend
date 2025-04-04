import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { InventoryAdjustment } from '../entities/inventory-adjustment.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetAllAdjustmentsDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all inventory adjustments' }),
      ApiResponse({
        status: 200,
        description: 'Inventory adjustments retrieved successfully',
        type: ApiResponseType<[InventoryAdjustment]>,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
