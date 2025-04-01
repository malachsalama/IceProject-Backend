import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDocs } from './docs/create-product.docs';
import { GetAllProductsDocs } from './docs/get-all-products.docs';
import { GetProductByIdDocs } from './docs/get-product-by-id.docs';
import { UpdateProductByIdDocs } from './docs/update-product-by-id.docs';
import { DeleteProductByIdDocs } from './docs/delete-product-by-id.docs';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.enums';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can create products
  @CreateProductDocs.create()
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CASHIER) // Admins and cashiers can view products
  @GetAllProductsDocs.get()
  findAllProducts(): Promise<ApiResponse<Product[]>> {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CASHIER) // Admins and cashiers can view a product
  @GetProductByIdDocs.get()
  findProductById(@Param('id') id: string): Promise<ApiResponse<Product>> {
    return this.productsService.findProductById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can update products
  @UpdateProductByIdDocs.update()
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can delete products
  @DeleteProductByIdDocs.delete()
  deleteProduct(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return this.productsService.deleteProduct(id);
  }
}
