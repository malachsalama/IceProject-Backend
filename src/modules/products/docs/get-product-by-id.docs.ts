import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';
import { Product } from '../entities/product.entity';

export const GetProductByIdDocs = {
  get: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a product by ID' }),
      ApiResponse({
        status: 200,
        description: 'Product retrieved successfully',
        type: () => ApiResponseType<Product>,
      }),
      ApiNotFoundResponse({
        description: 'Product not found',
      }),
    ),
};
