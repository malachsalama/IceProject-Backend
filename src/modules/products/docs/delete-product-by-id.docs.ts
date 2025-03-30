import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiResponse as ApiResponseType } from 'src/shared/types/response.type';

export const DeleteProductByIdDocs = {
  delete: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a product by ID' }),
      ApiResponse({
        status: 200,
        description: 'Product deleted successfully',
        type: () => ApiResponseType<boolean>,
      }),
      ApiNotFoundResponse({
        description: 'Product not found',
      }),
    ),
};
