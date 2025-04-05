import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SalesReport } from '../types/sales-report.type';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const SalesReportDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Generate a sales report' }),
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
        description: 'Sales report generated successfully',
        type: ApiResponseType<SalesReport>,
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
