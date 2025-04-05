import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { SalesReport } from './types/sales-report.type';
import { InventoryReport } from './types/inventory-report.type';
import { PurchaseReport } from './types/purchase-report.type';

describe('ReportsController', () => {
  let controller: ReportsController;

  const mockSalesReport: SalesReport = {
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
    sales: [],
  };

  const mockInventoryReport: InventoryReport = {
    total_products: 1,
    total_stock: 50,
    low_stock_products: [],
    products: [],
  };

  const mockPurchaseReport: PurchaseReport = {
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
    purchase_orders: [],
  };

  const mockService = {
    generateSalesReport: jest.fn(),
    generateInventoryReport: jest.fn(),
    generatePurchaseReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockService }],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSalesReport', () => {
    it('should generate a sales report and return the response', async () => {
      const filter: ReportFilterDto = {
        start_date: '2025-01-01',
        end_date: '2025-04-05',
      };
      const response: ApiResponse<SalesReport> = {
        message: 'Sales report generated successfully',
        data: mockSalesReport,
      };

      mockService.generateSalesReport.mockResolvedValue(response);

      const result = await controller.generateSalesReport(filter);

      expect(result).toEqual(response);
      expect(mockService.generateSalesReport).toHaveBeenCalledWith(filter);
    });
  });

  describe('generateInventoryReport', () => {
    it('should generate an inventory report and return the response', async () => {
      const response: ApiResponse<InventoryReport> = {
        message: 'Inventory report generated successfully',
        data: mockInventoryReport,
      };

      mockService.generateInventoryReport.mockResolvedValue(response);

      const result = await controller.generateInventoryReport();

      expect(result).toEqual(response);
      expect(mockService.generateInventoryReport).toHaveBeenCalled();
    });
  });

  describe('generatePurchaseReport', () => {
    it('should generate a purchase report and return the response', async () => {
      const filter: ReportFilterDto = {
        start_date: '2025-01-01',
        end_date: '2025-04-05',
      };
      const response: ApiResponse<PurchaseReport> = {
        message: 'Purchase report generated successfully',
        data: mockPurchaseReport,
      };

      mockService.generatePurchaseReport.mockResolvedValue(response);

      const result = await controller.generatePurchaseReport(filter);

      expect(result).toEqual(response);
      expect(mockService.generatePurchaseReport).toHaveBeenCalledWith(filter);
    });
  });
});
