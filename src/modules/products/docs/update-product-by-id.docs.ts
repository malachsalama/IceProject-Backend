import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';
import { Product } from '../entities/product.entity';

export const UpdateProductByIdDocs = {
  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update a product by ID' }),
      ApiResponse({
        status: 200,
        description: 'Product updated successfully',
        type: () => ApiResponseType<Product>,
      }),
      ApiNotFoundResponse({
        description: 'Product not found',
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid or missing data',
      }),
    ),
};
