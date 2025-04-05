import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';
import { ReportFilterDto } from './dto/report-filter.dto';
import { BadRequestException } from '@nestjs/common';

describe('ReportsService', () => {
  let service: ReportsService;

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
    customer_name: 'John Doe',
    customer_phone: '+1234567890',
    items: [mockSaleItem],
    created_at: new Date('2025-03-01'),
    updated_at: new Date(),
  };

  const mockSupplier = {
    id: '5e6f7g8h',
    name: 'Tech Supplies Inc.',
    contact_name: 'John Smith',
    contact_email: 'john@techsupplies.com',
    contact_phone: '+1234567890',
    address: '4th Ngong Avenue',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPurchaseOrder = {
    id: '6f7g8h9i',
    supplier: mockSupplier,
    total_amount: 9000.0,
    order_date: new Date('2025-03-01'),
    received_date: null,
    status: 'pending',
    items: [],
    created_at: new Date('2025-03-01'),
    updated_at: new Date(),
  };

  const mockSalesRepository = {
    find: jest.fn(),
  };

  const mockSaleItemsRepository = {
    find: jest.fn(),
  };

  const mockProductsRepository = {
    find: jest.fn(),
  };

  const mockPurchaseOrdersRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
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
        {
          provide: getRepositoryToken(PurchaseOrder),
          useValue: mockPurchaseOrdersRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSalesReport', () => {
    it('should generate a sales report with date filter', async () => {
      const filter: ReportFilterDto = {
        start_date: '2025-01-01',
        end_date: '2025-04-05',
      };

      mockSalesRepository.find.mockResolvedValue([mockSale]);

      const result = await service.generateSalesReport(filter);

      expect(result).toEqual({
        message: 'Sales report generated successfully',
        data: {
          total_sales: 1,
          total_amount: 1999.98,
          top_products: [
            {
              product_id: '1a2b3c4d',
              product_name: 'Laptop',
              total_quantity: 2,
              total_amount: 1999.98,
            },
          ],
          sales: [mockSale],
        },
      });
      expect(mockSalesRepository.find).toHaveBeenCalledWith({
        where: { created_at: expect.anything() },
        relations: ['items', 'items.product'],
      });
    });

    it('should generate a sales report without date filter', async () => {
      const filter: ReportFilterDto = {};

      mockSalesRepository.find.mockResolvedValue([mockSale]);

      const result = await service.generateSalesReport(filter);

      expect(result).toEqual({
        message: 'Sales report generated successfully',
        data: {
          total_sales: 1,
          total_amount: 1999.98,
          top_products: [
            {
              product_id: '1a2b3c4d',
              product_name: 'Laptop',
              total_quantity: 2,
              total_amount: 1999.98,
            },
          ],
          sales: [mockSale],
        },
      });
      expect(mockSalesRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['items', 'items.product'],
      });
    });

    it('should throw BadRequestException if start_date is greater than end_date', async () => {
      const filter: ReportFilterDto = {
        start_date: '2025-04-05',
        end_date: '2025-01-01',
      };

      await expect(service.generateSalesReport(filter)).rejects.toThrow(
        new BadRequestException('start_date cannot be greater than end_date'),
      );
    });
  });

  describe('generateInventoryReport', () => {
    it('should generate an inventory report', async () => {
      const lowStockProduct = { ...mockProduct, stock: 5 };
      mockProductsRepository.find.mockResolvedValue([
        mockProduct,
        lowStockProduct,
      ]);

      const result = await service.generateInventoryReport();

      expect(result).toEqual({
        message: 'Inventory report generated successfully',
        data: {
          total_products: 2,
          total_stock: 55,
          low_stock_products: [
            {
              product_id: '1a2b3c4d',
              product_name: 'Laptop',
              stock: 5,
            },
          ],
          products: [mockProduct, lowStockProduct],
        },
      });
      expect(mockProductsRepository.find).toHaveBeenCalled();
    });

    it('should handle empty product list', async () => {
      mockProductsRepository.find.mockResolvedValue([]);

      const result = await service.generateInventoryReport();

      expect(result).toEqual({
        message: 'Inventory report generated successfully',
        data: {
          total_products: 0,
          total_stock: 0,
          low_stock_products: [],
          products: [],
        },
      });
      expect(mockProductsRepository.find).toHaveBeenCalled();
    });
  });

  describe('generatePurchaseReport', () => {
    it('should generate a purchase report with date filter', async () => {
      const filter: ReportFilterDto = {
        start_date: '2025-01-01',
        end_date: '2025-04-05',
      };

      mockPurchaseOrdersRepository.find.mockResolvedValue([mockPurchaseOrder]);

      const result = await service.generatePurchaseReport(filter);

      expect(result).toEqual({
        message: 'Purchase report generated successfully',
        data: {
          total_purchase_orders: 1,
          total_amount: 9000.0,
          pending_orders: 1,
          supplier_summary: [
            {
              supplier_id: '5e6f7g8h',
              supplier_name: 'Tech Supplies Inc.',
              total_orders: 1,
              total_amount: 9000.0,
            },
          ],
          purchase_orders: [mockPurchaseOrder],
        },
      });
      expect(mockPurchaseOrdersRepository.find).toHaveBeenCalledWith({
        where: { order_date: expect.anything() },
        relations: ['supplier', 'items', 'items.product'],
      });
    });

    it('should generate a purchase report without date filter', async () => {
      const filter: ReportFilterDto = {};

      mockPurchaseOrdersRepository.find.mockResolvedValue([mockPurchaseOrder]);

      const result = await service.generatePurchaseReport(filter);

      expect(result).toEqual({
        message: 'Purchase report generated successfully',
        data: {
          total_purchase_orders: 1,
          total_amount: 9000.0,
          pending_orders: 1,
          supplier_summary: [
            {
              supplier_id: '5e6f7g8h',
              supplier_name: 'Tech Supplies Inc.',
              total_orders: 1,
              total_amount: 9000.0,
            },
          ],
          purchase_orders: [mockPurchaseOrder],
        },
      });
      expect(mockPurchaseOrdersRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['supplier', 'items', 'items.product'],
      });
    });

    it('should throw BadRequestException if start_date is greater than end_date', async () => {
      const filter: ReportFilterDto = {
        start_date: '2025-04-05',
        end_date: '2025-01-01',
      };

      await expect(service.generatePurchaseReport(filter)).rejects.toThrow(
        new BadRequestException('start_date cannot be greater than end_date'),
      );
    });
  });
});
