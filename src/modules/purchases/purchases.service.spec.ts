import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Factory function to create a fresh mockPurchaseOrder
const createMockPurchaseOrder = () => ({
  id: '3c4d5e6f',
  supplier: {
    id: '5e6f7g8h',
    name: 'Tech Supplies Inc.',
    contact_name: 'John Smith',
    contact_email: 'john@techsupplies.com',
    contact_phone: '+1234567890',
    address: '4th Ngong Avenue, Upper Hill, Nairobi',
    created_at: new Date(),
    updated_at: new Date(),
  },
  total_amount: 9000.0,
  order_date: new Date('2025-04-01'),
  received_date: null,
  status: 'pending',
  items: [
    {
      id: '2b3c4d5e',
      product: {
        id: '1a2b3c4d',
        name: 'Laptop',
        sku: 'LAP001',
        price: 999.99,
        stock: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      quantity: 10,
      unit_price: 900.0,
      subtotal: 9000.0,
    },
  ],
  created_at: new Date(),
  updated_at: new Date(),
});

describe('PurchasesService', () => {
  let service: PurchasesService;

  const mockSupplier = {
    id: '5e6f7g8h',
    name: 'Tech Supplies Inc.',
    contact_name: 'John Smith',
    contact_email: 'john@techsupplies.com',
    contact_phone: '+1234567890',
    address: '4th Ngong Avenue, Upper Hill, Nairobi',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProduct = {
    id: '1a2b3c4d',
    name: 'Laptop',
    sku: 'LAP001',
    price: 999.99,
    stock: 50,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPurchaseOrderItem = {
    id: '2b3c4d5e',
    product: mockProduct,
    quantity: 10,
    unit_price: 900.0,
    subtotal: 9000.0,
  };

  const mockSuppliersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockPurchaseOrdersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockPurchaseOrderItemsRepository = {
    create: jest.fn(),
  };

  const mockProductsRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSuppliersRepository,
        },
        {
          provide: getRepositoryToken(PurchaseOrder),
          useValue: mockPurchaseOrdersRepository,
        },
        {
          provide: getRepositoryToken(PurchaseOrderItem),
          useValue: mockPurchaseOrderItemsRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<PurchasesService>(PurchasesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSupplier', () => {
    it('should create a supplier', async () => {
      const createSupplierDto: CreateSupplierDto = {
        name: 'Tech Supplies Inc.',
        contact_name: 'John Smith',
        contact_email: 'john@techsupplies.com',
        contact_phone: '+1234567890',
        address: '123 Tech Street, City, Country',
      };

      mockSuppliersRepository.create.mockReturnValue(mockSupplier);
      mockSuppliersRepository.save.mockResolvedValue(mockSupplier);

      const result = await service.createSupplier(createSupplierDto);

      expect(result).toEqual({
        message: 'Supplier created successfully',
        data: mockSupplier,
      });
      expect(mockSuppliersRepository.create).toHaveBeenCalledWith(
        createSupplierDto,
      );
      expect(mockSuppliersRepository.save).toHaveBeenCalledWith(mockSupplier);
    });
  });

  describe('findAllSuppliers', () => {
    it('should return all suppliers', async () => {
      mockSuppliersRepository.find.mockResolvedValue([mockSupplier]);

      const result = await service.findAllSuppliers();

      expect(result).toEqual({
        message: 'Suppliers retrieved successfully',
        data: [mockSupplier],
      });
      expect(mockSuppliersRepository.find).toHaveBeenCalled();
    });

    it('should return empty array with appropriate message when no suppliers exist', async () => {
      mockSuppliersRepository.find.mockResolvedValue([]);

      const result = await service.findAllSuppliers();

      expect(result).toEqual({
        message: 'No suppliers found',
        data: [],
      });
      expect(mockSuppliersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findSupplierById', () => {
    it('should return a supplier by ID', async () => {
      mockSuppliersRepository.findOne.mockResolvedValue(mockSupplier);

      const result = await service.findSupplierById('5e6f7g8h');

      expect(result).toEqual({
        message: 'Supplier retrieved successfully',
        data: mockSupplier,
      });
      expect(mockSuppliersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '5e6f7g8h' },
      });
    });

    it('should throw NotFoundException if supplier does not exist', async () => {
      mockSuppliersRepository.findOne.mockResolvedValue(null);

      await expect(service.findSupplierById('nonexistent')).rejects.toThrow(
        new NotFoundException('Supplier with ID nonexistent not found'),
      );
      expect(mockSuppliersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('updateSupplier', () => {
    it('should update a supplier', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Updated Tech Supplies',
      };

      mockSuppliersRepository.findOne.mockResolvedValue(mockSupplier);
      mockSuppliersRepository.save.mockResolvedValue({
        ...mockSupplier,
        ...updateSupplierDto,
      });

      const result = await service.updateSupplier(
        '5e6f7g8h',
        updateSupplierDto,
      );

      expect(result).toEqual({
        message: 'Supplier updated successfully',
        data: { ...mockSupplier, ...updateSupplierDto },
      });
      expect(mockSuppliersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '5e6f7g8h' },
      });
      expect(mockSuppliersRepository.save).toHaveBeenCalledWith({
        ...mockSupplier,
        ...updateSupplierDto,
      });
    });
  });

  describe('deleteSupplier', () => {
    it('should delete a supplier', async () => {
      mockSuppliersRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteSupplier('5e6f7g8h');

      expect(result).toEqual({
        message: 'Supplier deleted successfully',
        data: true,
      });
      expect(mockSuppliersRepository.delete).toHaveBeenCalledWith('5e6f7g8h');
    });

    it('should throw NotFoundException if supplier does not exist', async () => {
      mockSuppliersRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteSupplier('nonexistent')).rejects.toThrow(
        new NotFoundException('Supplier with ID nonexistent not found'),
      );
      expect(mockSuppliersRepository.delete).toHaveBeenCalledWith(
        'nonexistent',
      );
    });
  });

  describe('createPurchaseOrder', () => {
    const mockPurchaseOrder = createMockPurchaseOrder();
    it('should create a purchase order', async () => {
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

      mockSuppliersRepository.findOne.mockResolvedValue(mockSupplier);
      mockProductsRepository.findOne.mockResolvedValue(mockProduct);
      mockPurchaseOrderItemsRepository.create.mockReturnValue(
        mockPurchaseOrderItem,
      );
      mockPurchaseOrdersRepository.create.mockReturnValue(mockPurchaseOrder);
      mockPurchaseOrdersRepository.save.mockResolvedValue(mockPurchaseOrder);

      const result = await service.createPurchaseOrder(createPurchaseOrderDto);

      expect(result).toEqual({
        message: 'Purchase order created successfully',
        data: mockPurchaseOrder,
      });
      expect(mockSuppliersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '5e6f7g8h' },
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
      expect(mockPurchaseOrderItemsRepository.create).toHaveBeenCalledWith({
        product: mockProduct,
        quantity: 10,
        unit_price: 900.0,
        subtotal: 9000.0,
      });
      expect(mockPurchaseOrdersRepository.create).toHaveBeenCalledWith({
        supplier: mockSupplier,
        total_amount: 9000.0,
        order_date: expect.any(Date),
        status: 'pending',
        items: [mockPurchaseOrderItem],
      });
      expect(mockPurchaseOrdersRepository.save).toHaveBeenCalledWith(
        mockPurchaseOrder,
      );
    });

    it('should throw NotFoundException if supplier does not exist', async () => {
      const createPurchaseOrderDto: CreatePurchaseOrderDto = {
        supplier_id: 'nonexistent',
        order_date: '2025-04-01',
        items: [
          {
            product_id: '1a2b3c4d',
            quantity: 10,
            unit_price: 900.0,
          },
        ],
      };

      mockSuppliersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createPurchaseOrder(createPurchaseOrderDto),
      ).rejects.toThrow(
        new NotFoundException('Supplier with ID nonexistent not found'),
      );
      expect(mockSuppliersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const createPurchaseOrderDto: CreatePurchaseOrderDto = {
        supplier_id: '5e6f7g8h',
        order_date: '2025-04-01',
        items: [
          {
            product_id: 'nonexistent',
            quantity: 10,
            unit_price: 900.0,
          },
        ],
      };

      mockSuppliersRepository.findOne.mockResolvedValue(mockSupplier);
      mockProductsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createPurchaseOrder(createPurchaseOrderDto),
      ).rejects.toThrow(
        new NotFoundException('Product with ID nonexistent not found'),
      );
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('findAllPurchaseOrders', () => {
    const mockPurchaseOrder = createMockPurchaseOrder();
    it('should return all purchase orders', async () => {
      mockPurchaseOrdersRepository.find.mockResolvedValue([mockPurchaseOrder]);

      const result = await service.findAllPurchaseOrders();

      expect(result).toEqual({
        message: 'Purchase orders retrieved successfully',
        data: [mockPurchaseOrder],
      });
      expect(mockPurchaseOrdersRepository.find).toHaveBeenCalledWith({
        relations: ['supplier', 'items', 'items.product'],
      });
    });

    it('should return empty array with appropriate message when no purchase orders exist', async () => {
      mockPurchaseOrdersRepository.find.mockResolvedValue([]);

      const result = await service.findAllPurchaseOrders();

      expect(result).toEqual({
        message: 'No purchase orders found',
        data: [],
      });
      expect(mockPurchaseOrdersRepository.find).toHaveBeenCalledWith({
        relations: ['supplier', 'items', 'items.product'],
      });
    });
  });

  describe('findPurchaseOrderById', () => {
    const mockPurchaseOrder = createMockPurchaseOrder();
    it('should return a purchase order by ID', async () => {
      mockPurchaseOrdersRepository.findOne.mockResolvedValue(mockPurchaseOrder);

      const result = await service.findPurchaseOrderById('3c4d5e6f');

      expect(result).toEqual({
        message: 'Purchase order retrieved successfully',
        data: mockPurchaseOrder,
      });
      expect(mockPurchaseOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '3c4d5e6f' },
        relations: ['supplier', 'items', 'items.product'],
      });
    });

    it('should throw NotFoundException if purchase order does not exist', async () => {
      mockPurchaseOrdersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findPurchaseOrderById('nonexistent'),
      ).rejects.toThrow(
        new NotFoundException('Purchase order with ID nonexistent not found'),
      );
      expect(mockPurchaseOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
        relations: ['supplier', 'items', 'items.product'],
      });
    });
  });

  describe('receivePurchaseOrder', () => {
    it('should mark a purchase order as received and update stock', async () => {
      const receivePurchaseOrderDto: ReceivePurchaseOrderDto = {
        received_date: '2025-04-05',
      };
      const freshMockPurchaseOrder = createMockPurchaseOrder();

      mockPurchaseOrdersRepository.findOne.mockResolvedValue(
        freshMockPurchaseOrder,
      );
      mockProductsRepository.findOne.mockResolvedValue(mockProduct);
      mockProductsRepository.save.mockResolvedValue({
        ...mockProduct,
        stock: 60,
      });
      mockPurchaseOrdersRepository.save.mockResolvedValue({
        ...freshMockPurchaseOrder,
        status: 'received',
        received_date: new Date('2025-04-05'),
      });

      const result = await service.receivePurchaseOrder(
        '3c4d5e6f',
        receivePurchaseOrderDto,
      );

      expect(result).toEqual({
        message: 'Purchase order received successfully',
        data: {
          ...freshMockPurchaseOrder,
          status: 'received',
          received_date: expect.any(Date),
        },
      });
      expect(mockPurchaseOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '3c4d5e6f' },
        relations: ['supplier', 'items', 'items.product'],
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
      expect(mockProductsRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        stock: 60,
      });
      expect(mockPurchaseOrdersRepository.save).toHaveBeenCalledWith({
        ...freshMockPurchaseOrder,
        status: 'received',
        received_date: expect.any(Date),
      });
    });

    it('should throw BadRequestException if purchase order is already received', async () => {
      const receivePurchaseOrderDto: ReceivePurchaseOrderDto = {
        received_date: '2025-04-05',
      };

      mockPurchaseOrdersRepository.findOne.mockResolvedValue({
        ...createMockPurchaseOrder(),
        status: 'received',
      });

      await expect(
        service.receivePurchaseOrder('3c4d5e6f', receivePurchaseOrderDto),
      ).rejects.toThrow(
        new BadRequestException('Purchase order has already been received'),
      );
    });

    it('should throw BadRequestException if purchase order is cancelled', async () => {
      const receivePurchaseOrderDto: ReceivePurchaseOrderDto = {
        received_date: '2025-04-05',
      };

      mockPurchaseOrdersRepository.findOne.mockResolvedValue({
        ...createMockPurchaseOrder(),
        status: 'cancelled',
      });

      await expect(
        service.receivePurchaseOrder('3c4d5e6f', receivePurchaseOrderDto),
      ).rejects.toThrow(
        new BadRequestException('Cannot receive a cancelled purchase order'),
      );
    });

    it('should throw NotFoundException if product does not exist during stock update', async () => {
      const receivePurchaseOrderDto: ReceivePurchaseOrderDto = {
        received_date: '2025-04-05',
      };
      const freshMockPurchaseOrder = createMockPurchaseOrder();

      mockPurchaseOrdersRepository.findOne.mockResolvedValue(
        freshMockPurchaseOrder,
      );
      mockProductsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.receivePurchaseOrder('3c4d5e6f', receivePurchaseOrderDto),
      ).rejects.toThrow(
        new NotFoundException('Product with ID 1a2b3c4d not found'),
      );
      expect(mockPurchaseOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '3c4d5e6f' },
        relations: ['supplier', 'items', 'items.product'],
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1a2b3c4d' },
      });
    });
  });

  describe('cancelPurchaseOrder', () => {
    it('should cancel a purchase order', async () => {
      const freshMockPurchaseOrder = createMockPurchaseOrder();

      mockPurchaseOrdersRepository.findOne.mockResolvedValue(
        freshMockPurchaseOrder,
      );
      mockPurchaseOrdersRepository.save.mockResolvedValue({
        ...freshMockPurchaseOrder,
        status: 'cancelled',
      });

      const result = await service.cancelPurchaseOrder('3c4d5e6f');

      expect(result).toEqual({
        message: 'Purchase order cancelled successfully',
        data: {
          ...freshMockPurchaseOrder,
          status: 'cancelled',
        },
      });
      expect(mockPurchaseOrdersRepository.findOne).toHaveBeenCalledWith({
        where: { id: '3c4d5e6f' },
        relations: ['supplier', 'items', 'items.product'],
      });
      expect(mockPurchaseOrdersRepository.save).toHaveBeenCalledWith({
        ...freshMockPurchaseOrder,
        status: 'cancelled',
      });
    });

    it('should throw BadRequestException if purchase order is already received', async () => {
      mockPurchaseOrdersRepository.findOne.mockResolvedValue({
        ...createMockPurchaseOrder(),
        status: 'received',
      });

      await expect(service.cancelPurchaseOrder('3c4d5e6f')).rejects.toThrow(
        new BadRequestException('Cannot cancel a received purchase order'),
      );
    });

    it('should throw BadRequestException if purchase order is already cancelled', async () => {
      mockPurchaseOrdersRepository.findOne.mockResolvedValue({
        ...createMockPurchaseOrder(),
        status: 'cancelled',
      });

      await expect(service.cancelPurchaseOrder('3c4d5e6f')).rejects.toThrow(
        new BadRequestException('Purchase order is already cancelled'),
      );
    });
  });
});
