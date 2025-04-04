import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInventoryAdjustmentDto } from './dto/create-inventory-adjustment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;

  const mockProduct = {
    id: '1a2b3c4d',
    name: 'Laptop',
    sku: 'LAP001',
    price: 999.99,
    stock: 50,
    created_at: new Date(),
    updated_at: new Date(),
    saleItems: [],
    purchaseOrderItems: [],
    inventoryAdjustments: [],
  };

  const mockAdjustment = {
    id: '2b3c4d5e',
    product: mockProduct,
    quantity: 5,
    adjustment_type: 'increase',
    reason: 'stock count',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockInventoryAdjustmentsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockProductsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(InventoryAdjustment),
          useValue: mockInventoryAdjustmentsRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdjustment', () => {
    it('should create an inventory adjustment (increase) and update stock', async () => {
      const createInventoryAdjustmentDto: CreateInventoryAdjustmentDto = {
        product_id: '1a2b3c4d',
        quantity: 5,
        adjustment_type: 'increase',
        reason: 'stock count',
      };

      const freshMockProduct = { ...mockProduct, stock: 50 };
      mockProductsRepository.findOne.mockResolvedValue(freshMockProduct);
      const updatedProduct = { ...freshMockProduct, stock: 55 };
      mockProductsRepository.save.mockResolvedValue(updatedProduct);
      mockInventoryAdjustmentsRepository.create.mockReturnValue(mockAdjustment);
      mockInventoryAdjustmentsRepository.save.mockResolvedValue(mockAdjustment);

      const result = await service.createAdjustment(
        createInventoryAdjustmentDto,
      );

      expect(result).toEqual({
        message: 'Inventory adjustment created successfully',
        data: mockAdjustment,
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
      expect(mockProductsRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(mockInventoryAdjustmentsRepository.create).toHaveBeenCalledWith({
        product: freshMockProduct,
        quantity: 5,
        adjustment_type: 'increase',
        reason: 'stock count',
      });
    });

    it('should create an inventory adjustment (decrease) and update stock', async () => {
      const createInventoryAdjustmentDto: CreateInventoryAdjustmentDto = {
        product_id: '1a2b3c4d',
        quantity: 5,
        adjustment_type: 'decrease',
        reason: 'damaged',
      };

      const freshMockProduct = { ...mockProduct, stock: 50 };
      mockProductsRepository.findOne.mockResolvedValue(freshMockProduct);
      const updatedProduct = { ...freshMockProduct, stock: 45 };
      mockProductsRepository.save.mockResolvedValue(updatedProduct);
      mockInventoryAdjustmentsRepository.create.mockReturnValue({
        ...mockAdjustment,
        adjustment_type: 'decrease',
        reason: 'damaged',
      });
      mockInventoryAdjustmentsRepository.save.mockResolvedValue({
        ...mockAdjustment,
        adjustment_type: 'decrease',
        reason: 'damaged',
      });

      const result = await service.createAdjustment(
        createInventoryAdjustmentDto,
      );

      expect(result).toEqual({
        message: 'Inventory adjustment created successfully',
        data: {
          ...mockAdjustment,
          adjustment_type: 'decrease',
          reason: 'damaged',
        },
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
      expect(mockProductsRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(mockInventoryAdjustmentsRepository.create).toHaveBeenCalledWith({
        product: freshMockProduct,
        quantity: 5,
        adjustment_type: 'decrease',
        reason: 'damaged',
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const createInventoryAdjustmentDto: CreateInventoryAdjustmentDto = {
        product_id: 'nonexistent',
        quantity: 5,
        adjustment_type: 'increase',
        reason: 'stock count',
      };

      mockProductsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createAdjustment(createInventoryAdjustmentDto),
      ).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
    });

    it('should throw BadRequestException if stock is insufficient for decrease', async () => {
      const createInventoryAdjustmentDto: CreateInventoryAdjustmentDto = {
        product_id: '1a2b3c4d',
        quantity: 100,
        adjustment_type: 'decrease',
        reason: 'damaged',
      };

      mockProductsRepository.findOne.mockResolvedValue({
        ...mockProduct,
        stock: 50,
      });

      await expect(
        service.createAdjustment(createInventoryAdjustmentDto),
      ).rejects.toThrow(
        new BadRequestException(
          'Insufficient stock for product Laptop. Available: 50, Requested to decrease: 100',
        ),
      );
    });
  });

  describe('findAllAdjustments', () => {
    it('should return all inventory adjustments', async () => {
      mockInventoryAdjustmentsRepository.find.mockResolvedValue([
        mockAdjustment,
      ]);

      const result = await service.findAllAdjustments();

      expect(result).toEqual({
        message: 'Inventory adjustments retrieved successfully',
        data: [mockAdjustment],
      });
    });

    it('should return empty array with appropriate message when no adjustments exist', async () => {
      mockInventoryAdjustmentsRepository.find.mockResolvedValue([]);

      const result = await service.findAllAdjustments();

      expect(result).toEqual({
        message: 'No adjustments found',
        data: [],
      });
    });
  });

  describe('findAdjustmentById', () => {
    it('should return an inventory adjustment by ID', async () => {
      mockInventoryAdjustmentsRepository.findOne.mockResolvedValue(
        mockAdjustment,
      );

      const result = await service.findAdjustmentById('2b3c4d5e');

      expect(result).toEqual({
        message: 'Inventory adjustment retrieved successfully',
        data: mockAdjustment,
      });
    });

    it('should throw NotFoundException if adjustment does not exist', async () => {
      mockInventoryAdjustmentsRepository.findOne.mockResolvedValue(null);

      await expect(service.findAdjustmentById('nonexistent')).rejects.toThrow(
        new NotFoundException(
          'Inventory adjustment with ID nonexistent not found',
        ),
      );
    });
  });

  describe('findProductInventoryHistory', () => {
    it('should return inventory history for a product', async () => {
      mockProductsRepository.findOne.mockResolvedValue(mockProduct);
      mockInventoryAdjustmentsRepository.find.mockResolvedValue([
        mockAdjustment,
      ]);

      const result = await service.findProductInventoryHistory('1a2b3c4d');

      expect(result).toEqual({
        message: 'Inventory history retrieved successfully',
        data: [mockAdjustment],
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findProductInventoryHistory('nonexistent'),
      ).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
    });

    it('should return empty array with appropriate message when no history exists', async () => {
      mockProductsRepository.findOne.mockResolvedValue(mockProduct);
      mockInventoryAdjustmentsRepository.find.mockResolvedValue([]);

      const result = await service.findProductInventoryHistory('1a2b3c4d');

      expect(result).toEqual({
        message: 'No inventory history found',
        data: [],
      });
    });
  });
});
