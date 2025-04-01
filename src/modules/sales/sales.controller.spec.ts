// src/sales/sales.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { Sale } from './entities/sale.entity';

describe('SalesController', () => {
  let controller: SalesController;

  const mockSale = {
    id: '3c4d5e6f',
    total_amount: 1999.98,
    customer_name: 'Jane Doe',
    customer_phone: '+1234567890',
    items: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockService = {
    createSale: jest.fn(),
    findAllSales: jest.fn(),
    findSaleById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [{ provide: SalesService, useValue: mockService }],
    }).compile();

    controller = module.get<SalesController>(SalesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSale', () => {
    it('should create a sale and return the response', async () => {
      const createSaleDto: CreateSaleDto = {
        customer_name: 'Jane Doe',
        customer_phone: '+1234567890',
        items: [
          {
            product_id: '1a2b3c4d',
            quantity: 2,
          },
        ],
      };
      const response: ApiResponse<Sale> = {
        message: 'Sale created successfully',
        data: mockSale,
      };

      mockService.createSale.mockResolvedValue(response);

      const result = await controller.createSale(createSaleDto);

      expect(result).toEqual(response);
      expect(mockService.createSale).toHaveBeenCalledWith(createSaleDto);
    });
  });

  describe('findAllSales', () => {
    it('should return all sales', async () => {
      const response: ApiResponse<Sale[]> = {
        message: 'Sales retrieved successfully',
        data: [mockSale],
      };

      mockService.findAllSales.mockResolvedValue(response);

      const result = await controller.findAllSales();

      expect(result).toEqual(response);
      expect(mockService.findAllSales).toHaveBeenCalled();
    });
  });

  describe('findSaleById', () => {
    it('should return a sale by ID', async () => {
      const response: ApiResponse<Sale> = {
        message: 'Sale retrieved successfully',
        data: mockSale,
      };

      mockService.findSaleById.mockResolvedValue(response);

      const result = await controller.findSaleById('3c4d5e6f');

      expect(result).toEqual(response);
      expect(mockService.findSaleById).toHaveBeenCalledWith('3c4d5e6f');
    });
  });
});
