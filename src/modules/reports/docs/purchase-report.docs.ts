import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PurchaseReport } from '../types/purchase-report.type';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const PurchaseReportDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Generate a purchase report' }),
      ApiQuery({
        name: 'start_date',
        type: String,
        required: false,
        description: 'Start date for the report (YYYY-MM-DD)',
        example: '2025-01-01',
      }),
      ApiQuery({
        name: 'end_date',
        type: String,
        required: false,
        description: 'End date for the report (YYYY-MM-DD)',
        example: '2025-04-05',
      }),
      ApiResponse({
        status: 200,
        description: 'Purchase report generated successfully',
        type: ApiResponseType<PurchaseReport>,
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid date range',
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
