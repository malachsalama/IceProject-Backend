import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Sale } from '../entities/sale.entity';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';

export const GetAllSalesDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all sales' }),
      ApiResponse({
        status: 200,
        description: 'Sales retrieved successfully',
        type: ApiResponseType<[Sale]>,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid or missing token',
      }),
      ApiForbiddenResponse({
        description: 'Forbidden - User does not have the required role',
      }),
    ),
};
