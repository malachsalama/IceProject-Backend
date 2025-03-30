import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from 'src/shared/types/response.type';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    const newProduct = this.productsRepository.create(createProductDto);
    const savedProduct = await this.productsRepository.save(newProduct);
    return new ApiResponse<Product>({
      message: 'Product created successfully',
      data: savedProduct,
    });
  }

  async findAllProducts(): Promise<ApiResponse<Product[]>> {
    const products = await this.productsRepository.find();
    return new ApiResponse<Product[]>({
      message:
        products.length > 0
          ? 'Products retrieved successfully'
          : 'No products found',
      data: products,
    });
  }

  async findProductById(id: string): Promise<ApiResponse<Product>> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return new ApiResponse<Product>({
      message: 'Product retrieved successfully',
      data: product,
    });
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    const productResponse = await this.findProductById(id);
    const product = productResponse.data;
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productsRepository.save(product);
    return new ApiResponse<Product>({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return new ApiResponse<boolean>({
      message: 'Product deleted successfully',
      data: true,
    });
  }
}
