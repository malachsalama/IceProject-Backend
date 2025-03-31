import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '../../shared/types/response.type';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct = {
    id: '1a2b3c4d',
    name: 'Laptop',
    sku: 'LAP001',
    price: 999.99,
    stock: 50,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create and return a product with success message', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Laptop',
        sku: 'LAP001',
        price: 999.99,
        stock: 50,
      };

      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result: ApiResponse<Product> =
        await service.createProduct(createProductDto);
      expect(result).toEqual({
        message: 'Product created successfully',
        data: mockProduct,
      });

      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products with success message', async () => {
      const products = [mockProduct];
      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAllProducts();

      expect(result).toEqual({
        message: 'Products retrieved successfully',
        data: products,
      });
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array with appropriate message when no products exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAllProducts();

      expect(result).toEqual({
        message: 'No products found',
        data: [],
      });
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID with success message', async () => {
      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findProductById('1a2b3c4d');

      expect(result).toEqual({
        message: 'Product retrieved successfully',
        data: mockProduct,
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
    });

    it('should throw NotFoundException when product is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findProductById('nonexistent')).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('updateProduct', () => {
    it('should update and return the updated product with success message', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Laptop' };
      const updatedProduct = { ...mockProduct, ...updateProductDto };

      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(
        mockProduct.id,
        updateProductDto,
      );

      expect(result).toEqual({
        message: 'Product updated successfully',
        data: updatedProduct,
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        ...updateProductDto,
      });
    });

    it('should throw NotFoundException when updating a non-existent product', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const updateProductDto: UpdateProductDto = { name: 'Updated Laptop' };

      await expect(
        service.updateProduct('nonexistent', updateProductDto),
      ).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return success message', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteProduct('1a2b3c4d');

      expect(result).toEqual({
        message: 'Product deleted successfully',
        data: true,
      });
      expect(mockRepository.delete).toHaveBeenCalledWith('1a2b3c4d');
    });

    it('should throw NotFoundException when deleting a non-existent product', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteProduct('nonexistent')).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
      expect(mockRepository.delete).toHaveBeenCalledWith('nonexistent');
    });
  });
});
