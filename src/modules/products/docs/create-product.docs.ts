import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from '../../../shared/types/response.type';
import { Product } from '../entities/product.entity';

export const CreateProductDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new product' }),
      ApiResponse({
        status: 201,
        description: 'Product created successfully',
        type: () => ApiResponseType<Product>,
      }),
      ApiBadRequestResponse({
        description: 'Bad Request - Invalid or missing data',
      }),
    ),
};
