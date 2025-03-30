import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from 'src/shared/types/response.type';
import { Product } from '../entities/product.entity';

export const GetAllProductsDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all products' }),
      ApiResponse({
        status: 200,
        description: 'Products retrieved successfully',
        type: () => ApiResponseType<Product[]>,
      }),
    ),
};
