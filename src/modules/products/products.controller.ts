import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDocs } from './docs/create-product.docs';
import { GetAllProductsDocs } from './docs/get-all-products.docs';
import { GetProductByIdDocs } from './docs/get-product-by-id.docs';
import { UpdateProductByIdDocs } from './docs/update-product-by-id.docs';
import { DeleteProductByIdDocs } from './docs/delete-product-by-id.docs';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @CreateProductDocs.create()
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @GetAllProductsDocs.get()
  findAllProducts(): Promise<ApiResponse<Product[]>> {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  @GetProductByIdDocs.get()
  findProductById(@Param('id') id: string): Promise<ApiResponse<Product>> {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  @UpdateProductByIdDocs.update()
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @DeleteProductByIdDocs.delete()
  deleteProduct(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return this.productsService.deleteProduct(id);
  }
}
