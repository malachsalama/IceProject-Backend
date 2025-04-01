// src/products/products.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ApiResponse } from '../../shared/types/response.type';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProduct = {
    id: '1a2b3c4d',
    name: 'Laptop',
    sku: 'LAP-001',
    price: 999.99,
    stock: 50,
    created_at: new Date(),
    updated_at: new Date(),
    saleItems: [],
  };

  const mockService = {
    createProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product and return the response', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Laptop',
        sku: 'LAP-001',
        price: 999.99,
        stock: 50,
      };
      const response: ApiResponse<Product> = {
        message: 'Product created successfully',
        data: mockProduct,
      };

      mockService.createProduct.mockResolvedValue(response);

      const result = await controller.createProduct(createProductDto);

      expect(result).toEqual(response);
      expect(mockService.createProduct).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products', async () => {
      const response: ApiResponse<Product[]> = {
        message: 'Products retrieved successfully',
        data: [mockProduct],
      };

      mockService.findAllProducts.mockResolvedValue(response);

      const result = await controller.findAllProducts();

      expect(result).toEqual(response);
      expect(mockService.findAllProducts).toHaveBeenCalled();
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID', async () => {
      const response: ApiResponse<Product> = {
        message: 'Product retrieved successfully',
        data: mockProduct,
      };

      mockService.findProductById.mockResolvedValue(response);

      const result = await controller.findProductById('1a2b3c4d');

      expect(result).toEqual(response);
      expect(mockService.findProductById).toHaveBeenCalledWith('1a2b3c4d');
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return the response', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Laptop' };
      const response: ApiResponse<Product> = {
        message: 'Product updated successfully',
        data: { ...mockProduct, ...updateProductDto },
      };

      mockService.updateProduct.mockResolvedValue(response);

      const result = await controller.updateProduct(
        '1a2b3c4d',
        updateProductDto,
      );

      expect(result).toEqual(response);
      expect(mockService.updateProduct).toHaveBeenCalledWith(
        '1a2b3c4d',
        updateProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return the response', async () => {
      const response: ApiResponse<boolean> = {
        message: 'Product deleted successfully',
        data: true,
      };

      mockService.deleteProduct.mockResolvedValue(response);

      const result = await controller.deleteProduct('1a2b3c4d');

      expect(result).toEqual(response);
      expect(mockService.deleteProduct).toHaveBeenCalledWith('1a2b3c4d');
    });
  });
});
