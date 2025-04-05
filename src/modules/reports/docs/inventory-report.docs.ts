import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { InventoryReport } from '../types/inventory-report.type';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const InventoryReportDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Generate an inventory report' }),
      ApiResponse({
        status: 200,
        description: 'Inventory report generated successfully',
        type: ApiResponseType<InventoryReport>,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
