import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';

describe('PurchasesController', () => {
  let controller: PurchasesController;

  const mockSupplier = {
    id: '5e6f7g8h',
    name: 'Tech Supplies Inc.',
    contact_name: 'John Smith',
    contact_email: 'john@techsupplies.com',
    contact_phone: '+1234567890',
    address: '123 Tech Street, City, Country',
    created_at: new Date(),
    updated_at: new Date(),
    purchaseOrders: [],
  };

  const mockPurchaseOrder = {
    id: '3c4d5e6f',
    supplier: mockSupplier,
    total_amount: 9000.0,
    order_date: new Date('2025-04-01'),
    received_date: new Date(),
    status: 'pending',
    items: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockService = {
    createSupplier: jest.fn(),
    findAllSuppliers: jest.fn(),
    findSupplierById: jest.fn(),
    updateSupplier: jest.fn(),
    deleteSupplier: jest.fn(),
    createPurchaseOrder: jest.fn(),
    findAllPurchaseOrders: jest.fn(),
    findPurchaseOrderById: jest.fn(),
    receivePurchaseOrder: jest.fn(),
    cancelPurchaseOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      providers: [{ provide: PurchasesService, useValue: mockService }],
    }).compile();

    controller = module.get<PurchasesController>(PurchasesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSupplier', () => {
    it('should create a supplier and return the response', async () => {
      const createSupplierDto: CreateSupplierDto = {
        name: 'Tech Supplies Inc.',
        contact_name: 'John Smith',
        contact_email: 'john@techsupplies.com',
        contact_phone: '+1234567890',
        address: '123 Tech Street, City, Country',
      };
      const response: ApiResponse<Supplier> = {
        message: 'Supplier created successfully',
        data: mockSupplier,
      };

      mockService.createSupplier.mockResolvedValue(response);

      const result = await controller.createSupplier(createSupplierDto);

      expect(result).toEqual(response);
      expect(mockService.createSupplier).toHaveBeenCalledWith(
        createSupplierDto,
      );
    });
  });

  describe('findAllSuppliers', () => {
    it('should return all suppliers', async () => {
      const response: ApiResponse<Supplier[]> = {
        message: 'Suppliers retrieved successfully',
        data: [mockSupplier],
      };

      mockService.findAllSuppliers.mockResolvedValue(response);

      const result = await controller.findAllSuppliers();

      expect(result).toEqual(response);
      expect(mockService.findAllSuppliers).toHaveBeenCalled();
    });
  });

  describe('findSupplierById', () => {
    it('should return a supplier by ID', async () => {
      const response: ApiResponse<Supplier> = {
        message: 'Supplier retrieved successfully',
        data: mockSupplier,
      };

      mockService.findSupplierById.mockResolvedValue(response);

      const result = await controller.findSupplierById('5e6f7g8h');

      expect(result).toEqual(response);
      expect(mockService.findSupplierById).toHaveBeenCalledWith('5e6f7g8h');
    });
  });

  describe('updateSupplier', () => {
    it('should update a supplier and return the response', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Updated Tech Supplies',
      };
      const response: ApiResponse<Supplier> = {
        message: 'Supplier updated successfully',
        data: { ...mockSupplier, ...updateSupplierDto },
      };

      mockService.updateSupplier.mockResolvedValue(response);

      const result = await controller.updateSupplier(
        '5e6f7g8h',
        updateSupplierDto,
      );

      expect(result).toEqual(response);
      expect(mockService.updateSupplier).toHaveBeenCalledWith(
        '5e6f7g8h',
        updateSupplierDto,
      );
    });
  });

  describe('deleteSupplier', () => {
    it('should delete a supplier and return the response', async () => {
      const response: ApiResponse<boolean> = {
        message: 'Supplier deleted successfully',
        data: true,
      };

      mockService.deleteSupplier.mockResolvedValue(response);

      const result = await controller.deleteSupplier('5e6f7g8h');

      expect(result).toEqual(response);
      expect(mockService.deleteSupplier).toHaveBeenCalledWith('5e6f7g8h');
    });
  });

  describe('createPurchaseOrder', () => {
    it('should create a purchase order and return the response', async () => {
      const createPurchaseOrderDto: CreatePurchaseOrderDto = {
        supplier_id: '5e6f7g8h',
        order_date: '2025-04-01',
        items: [
          {
            product_id: '1a2b3c4d',
            quantity: 10,
            unit_price: 900.0,
          },
        ],
      };
      const response: ApiResponse<PurchaseOrder> = {
        message: 'Purchase order created successfully',
        data: mockPurchaseOrder,
      };

      mockService.createPurchaseOrder.mockResolvedValue(response);

      const result = await controller.createPurchaseOrder(
        createPurchaseOrderDto,
      );

      expect(result).toEqual(response);
      expect(mockService.createPurchaseOrder).toHaveBeenCalledWith(
        createPurchaseOrderDto,
      );
    });
  });

  describe('findAllPurchaseOrders', () => {
    it('should return all purchase orders', async () => {
      const response: ApiResponse<PurchaseOrder[]> = {
        message: 'Purchase orders retrieved successfully',
        data: [mockPurchaseOrder],
      };

      mockService.findAllPurchaseOrders.mockResolvedValue(response);

      const result = await controller.findAllPurchaseOrders();

      expect(result).toEqual(response);
      expect(mockService.findAllPurchaseOrders).toHaveBeenCalled();
    });
  });

  describe('findPurchaseOrderById', () => {
    it('should return a purchase order by ID', async () => {
      const response: ApiResponse<PurchaseOrder> = {
        message: 'Purchase order retrieved successfully',
        data: mockPurchaseOrder,
      };

      mockService.findPurchaseOrderById.mockResolvedValue(response);

      const result = await controller.findPurchaseOrderById('3c4d5e6f');

      expect(result).toEqual(response);
      expect(mockService.findPurchaseOrderById).toHaveBeenCalledWith(
        '3c4d5e6f',
      );
    });
  });

  describe('receivePurchaseOrder', () => {
    it('should mark a purchase order as received and return the response', async () => {
      const receivePurchaseOrderDto: ReceivePurchaseOrderDto = {
        received_date: '2025-04-05',
      };
      const response: ApiResponse<PurchaseOrder> = {
        message: 'Purchase order received successfully',
        data: {
          ...mockPurchaseOrder,
          status: 'received',
          received_date: new Date('2025-04-05'),
        },
      };

      mockService.receivePurchaseOrder.mockResolvedValue(response);

      const result = await controller.receivePurchaseOrder(
        '3c4d5e6f',
        receivePurchaseOrderDto,
      );

      expect(result).toEqual(response);
      expect(mockService.receivePurchaseOrder).toHaveBeenCalledWith(
        '3c4d5e6f',
        receivePurchaseOrderDto,
      );
    });
  });

  describe('cancelPurchaseOrder', () => {
    it('should cancel a purchase order and return the response', async () => {
      const response: ApiResponse<PurchaseOrder> = {
        message: 'Purchase order cancelled successfully',
        data: { ...mockPurchaseOrder, status: 'cancelled' },
      };

      mockService.cancelPurchaseOrder.mockResolvedValue(response);

      const result = await controller.cancelPurchaseOrder('3c4d5e6f');

      expect(result).toEqual(response);
      expect(mockService.cancelPurchaseOrder).toHaveBeenCalledWith('3c4d5e6f');
    });
  });
});
