import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { CreateInventoryAdjustmentDto } from './dto/create-inventory-adjustment.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';

describe('InventoryController', () => {
  let controller: InventoryController;

  const mockAdjustment = {
    id: '2b3c4d5e',
    product: {
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
    },
    quantity: 5,
    adjustment_type: 'increase',
    reason: 'stock count',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockService = {
    createAdjustment: jest.fn(),
    findAllAdjustments: jest.fn(),
    findAdjustmentById: jest.fn(),
    findProductInventoryHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [{ provide: InventoryService, useValue: mockService }],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdjustment', () => {
    it('should create an inventory adjustment and return the response', async () => {
      const createInventoryAdjustmentDto: CreateInventoryAdjustmentDto = {
        product_id: '1a2b3c4d',
        quantity: 5,
        adjustment_type: 'increase',
        reason: 'stock count',
      };
      const response: ApiResponse<InventoryAdjustment> = {
        message: 'Inventory adjustment created successfully',
        data: mockAdjustment,
      };

      mockService.createAdjustment.mockResolvedValue(response);

      const result = await controller.createAdjustment(
        createInventoryAdjustmentDto,
      );

      expect(result).toEqual(response);
      expect(mockService.createAdjustment).toHaveBeenCalledWith(
        createInventoryAdjustmentDto,
      );
    });
  });

  describe('findAllAdjustments', () => {
    it('should return all inventory adjustments', async () => {
      const response: ApiResponse<InventoryAdjustment[]> = {
        message: 'Inventory adjustments retrieved successfully',
        data: [mockAdjustment],
      };

      mockService.findAllAdjustments.mockResolvedValue(response);

      const result = await controller.findAllAdjustments();

      expect(result).toEqual(response);
      expect(mockService.findAllAdjustments).toHaveBeenCalled();
    });
  });

  describe('findAdjustmentById', () => {
    it('should return an inventory adjustment by ID', async () => {
      const response: ApiResponse<InventoryAdjustment> = {
        message: 'Inventory adjustment retrieved successfully',
        data: mockAdjustment,
      };

      mockService.findAdjustmentById.mockResolvedValue(response);

      const result = await controller.findAdjustmentById('2b3c4d5e');

      expect(result).toEqual(response);
      expect(mockService.findAdjustmentById).toHaveBeenCalledWith('2b3c4d5e');
    });
  });

  describe('findProductInventoryHistory', () => {
    it('should return inventory history for a product', async () => {
      const response: ApiResponse<InventoryAdjustment[]> = {
        message: 'Inventory history retrieved successfully',
        data: [mockAdjustment],
      };

      mockService.findProductInventoryHistory.mockResolvedValue(response);

      const result = await controller.findProductInventoryHistory('1a2b3c4d');

      expect(result).toEqual(response);
      expect(mockService.findProductInventoryHistory).toHaveBeenCalledWith(
        '1a2b3c4d',
      );
    });
  });
});
