import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { InventoryAdjustment } from '../entities/inventory-adjustment.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const CreateAdjustmentDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new inventory adjustment' }),
      ApiResponse({
        status: 201,
        description: 'Inventory adjustment created successfully',
        type: ApiResponseType<InventoryAdjustment>,
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid data or insufficient stock',
      }),
      ApiNotFoundResponse({
        description: 'Not Found - Product not found',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
