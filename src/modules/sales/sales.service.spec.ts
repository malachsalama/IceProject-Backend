import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SalesService', () => {
  let service: SalesService;

  const mockProduct = {
    id: '1a2b3c4d',
    name: 'Laptop',
    sku: 'LAP001',
    price: 999.99,
    stock: 50,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSaleItem = {
    id: '2b3c4d5e',
    product: mockProduct,
    quantity: 2,
    unit_price: 999.99,
    subtotal: 1999.98,
  };

  const mockSale = {
    id: '3c4d5e6f',
    total_amount: 1999.98,
    customer_name: 'Jane Doe',
    customer_phone: '+1234567890',
    items: [mockSaleItem],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSalesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSaleItemsRepository = {
    create: jest.fn(),
  };

  const mockProductsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockProduct.stock = 50; // Reset stock before each test
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(Sale),
          useValue: mockSalesRepository,
        },
        {
          provide: getRepositoryToken(SaleItem),
          useValue: mockSaleItemsRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSale', () => {
    it('should create a sale and update product stock', async () => {
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

      mockProductsRepository.findOne
        .mockResolvedValueOnce(mockProduct) // First call (validation)
        .mockResolvedValueOnce(mockProduct); // Second call (stock update)
      mockSaleItemsRepository.create.mockReturnValue(mockSaleItem);
      mockSalesRepository.create.mockReturnValue(mockSale);
      mockSalesRepository.save.mockResolvedValue(mockSale);
      mockProductsRepository.save.mockResolvedValue({
        ...mockProduct,
        stock: 48,
      });

      const result = await service.createSale(createSaleDto);

      expect(result).toEqual({
        message: 'Sale created successfully',
        data: mockSale,
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
      expect(mockSaleItemsRepository.create).toHaveBeenCalledWith({
        product: mockProduct,
        quantity: 2,
        unit_price: 999.99,
        subtotal: 1999.98,
      });
      expect(mockSalesRepository.create).toHaveBeenCalledWith({
        total_amount: 1999.98,
        customer_name: 'Jane Doe',
        customer_phone: '+1234567890',
        items: [mockSaleItem],
      });
      expect(mockSalesRepository.save).toHaveBeenCalledWith(mockSale);
      expect(mockProductsRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        stock: 48,
      });
    });

    it('should throw NotFoundException if product does not exist during validation', async () => {
      const createSaleDto: CreateSaleDto = {
        customer_name: 'Jane Doe',
        customer_phone: '+1234567890',
        items: [
          {
            product_id: 'nonexistent',
            quantity: 2,
          },
        ],
      };

      mockProductsRepository.findOne.mockResolvedValue(null);

      await expect(service.createSale(createSaleDto)).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });

    it('should throw NotFoundException if product does not exist during stock update', async () => {
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

      mockProductsRepository.findOne
        .mockResolvedValueOnce(mockProduct) // First call (validation)
        .mockResolvedValueOnce(null); // Second call (stock update)
      mockSaleItemsRepository.create.mockReturnValue(mockSaleItem);
      mockSalesRepository.create.mockReturnValue(mockSale);
      mockSalesRepository.save.mockResolvedValue(mockSale);

      await expect(service.createSale(createSaleDto)).rejects.toThrow(
        new NotFoundException('Product with ID 1a2b3c4d not found'),
      );
      expect(mockProductsRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      const createSaleDto: CreateSaleDto = {
        customer_name: 'Jane Doe',
        customer_phone: '+1234567890',
        items: [
          {
            product_id: '1a2b3c4d',
            quantity: 100,
          },
        ],
      };

      mockProductsRepository.findOne.mockResolvedValue(mockProduct);

      await expect(service.createSale(createSaleDto)).rejects.toThrow(
        new BadRequestException(
          'Insufficient stock for product Laptop. Available: 50, Requested: 100',
        ),
      );
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
    });
  });

  describe('findAllSales', () => {
    it('should return all sales', async () => {
      mockSalesRepository.find.mockResolvedValue([mockSale]);

      const result = await service.findAllSales();

      expect(result).toEqual({
        message: 'Sales retrieved successfully',
        data: [mockSale],
      });
      expect(mockSalesRepository.find).toHaveBeenCalledWith({
        relations: ['items', 'items.product'],
      });
    });

    it('should return empty array with appropriate message when no sales exist', async () => {
      mockSalesRepository.find.mockResolvedValue([]);

      const result = await service.findAllSales();

      expect(result).toEqual({
        message: 'No sales found',
        data: [],
      });
      expect(mockSalesRepository.find).toHaveBeenCalledWith({
        relations: ['items', 'items.product'],
      });
    });
  });

  describe('findSaleById', () => {
    it('should return a sale by ID', async () => {
      mockSalesRepository.findOne.mockResolvedValue(mockSale);

      const result = await service.findSaleById('3c4d5e6f');

      expect(result).toEqual({
        message: 'Sale retrieved successfully',
        data: mockSale,
      });
      expect(mockSalesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '3c4d5e6f' },
        relations: ['items', 'items.product'],
      });
    });

    it('should throw NotFoundException if sale does not exist', async () => {
      mockSalesRepository.findOne.mockResolvedValue(null);

      await expect(service.findSaleById('nonexistent')).rejects.toThrow(
        new NotFoundException('Sale with ID nonexistent not found'),
      );
      expect(mockSalesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
        relations: ['items', 'items.product'],
      });
    });
  });
});
