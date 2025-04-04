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

export const GetAdjustmentByIdDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get an inventory adjustment by ID' }),
      ApiResponse({
        status: 200,
        description: 'Inventory adjustment retrieved successfully',
        type: ApiResponseType<InventoryAdjustment>,
      }),
      ApiNotFoundResponse({
        description:
          'Not Found - Inventory adjustment with the specified ID does not exist',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
