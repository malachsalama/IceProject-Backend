import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { ApiResponse } from '../../shared/types/response.type';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrdersRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemsRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // Supplier Management
  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<ApiResponse<Supplier>> {
    const supplier = this.suppliersRepository.create(createSupplierDto);
    const savedSupplier = await this.suppliersRepository.save(supplier);
    return new ApiResponse<Supplier>({
      message: 'Supplier created successfully',
      data: savedSupplier,
    });
  }

  async findAllSuppliers(): Promise<ApiResponse<Supplier[]>> {
    const suppliers = await this.suppliersRepository.find();
    return new ApiResponse<Supplier[]>({
      message:
        suppliers.length > 0
          ? 'Suppliers retrieved successfully'
          : 'No suppliers found',
      data: suppliers,
    });
  }

  async findSupplierById(id: string): Promise<ApiResponse<Supplier>> {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });
    if (!supplier)
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    return new ApiResponse<Supplier>({
      message: 'Supplier retrieved successfully',
      data: supplier,
    });
  }

  async updateSupplier(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<ApiResponse<Supplier>> {
    const supplierResponse = await this.findSupplierById(id);
    const supplier = supplierResponse.data;
    Object.assign(supplier, updateSupplierDto);
    const updatedSupplier = await this.suppliersRepository.save(supplier);
    return new ApiResponse<Supplier>({
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    });
  }

  async deleteSupplier(id: string): Promise<ApiResponse<boolean>> {
    const result = await this.suppliersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return new ApiResponse<boolean>({
      message: 'Supplier deleted successfully',
      data: true,
    });
  }

  // Purchase Order Management
  async createPurchaseOrder(
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<ApiResponse<PurchaseOrder>> {
    // Validate supplier
    const supplier = await this.suppliersRepository.findOne({
      where: { id: createPurchaseOrderDto.supplier_id },
    });
    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${createPurchaseOrderDto.supplier_id} not found`,
      );
    }

    // Validate products and calculate total amount
    let total_amount = 0;
    const purchaseOrderItems: PurchaseOrderItem[] = [];

    for (const itemDto of createPurchaseOrderDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: itemDto.product_id },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${itemDto.product_id} not found`,
        );
      }

      const subtotal = itemDto.unit_price * itemDto.quantity;
      total_amount += subtotal;

      const purchaseOrderItem = this.purchaseOrderItemsRepository.create({
        product,
        quantity: itemDto.quantity,
        unit_price: itemDto.unit_price,
        subtotal,
      });
      purchaseOrderItems.push(purchaseOrderItem);
    }

    // Create the purchase order
    const purchaseOrder = this.purchaseOrdersRepository.create({
      supplier,
      total_amount,
      order_date: new Date(createPurchaseOrderDto.order_date),
      status: 'pending',
      items: purchaseOrderItems,
    });

    const savedPurchaseOrder =
      await this.purchaseOrdersRepository.save(purchaseOrder);
    return new ApiResponse<PurchaseOrder>({
      message: 'Purchase order created successfully',
      data: savedPurchaseOrder,
    });
  }

  async findAllPurchaseOrders(): Promise<ApiResponse<PurchaseOrder[]>> {
    const purchaseOrders = await this.purchaseOrdersRepository.find({
      relations: ['supplier', 'items', 'items.product'],
    });
    return new ApiResponse<PurchaseOrder[]>({
      message:
        purchaseOrders.length > 0
          ? 'Purchase orders retrieved successfully'
          : 'No purchase orders found',
      data: purchaseOrders,
    });
  }

  async findPurchaseOrderById(id: string): Promise<ApiResponse<PurchaseOrder>> {
    const purchaseOrder = await this.purchaseOrdersRepository.findOne({
      where: { id },
      relations: ['supplier', 'items', 'items.product'],
    });
    if (!purchaseOrder)
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    return new ApiResponse<PurchaseOrder>({
      message: 'Purchase order retrieved successfully',
      data: purchaseOrder,
    });
  }

  async receivePurchaseOrder(
    id: string,
    receivePurchaseOrderDto: ReceivePurchaseOrderDto,
  ): Promise<ApiResponse<PurchaseOrder>> {
    const purchaseOrderResponse = await this.findPurchaseOrderById(id);
    const purchaseOrder = purchaseOrderResponse.data;

    if (purchaseOrder.status === 'received') {
      throw new BadRequestException('Purchase order has already been received');
    }

    if (purchaseOrder.status === 'cancelled') {
      throw new BadRequestException(
        'Cannot receive a cancelled purchase order',
      );
    }

    // Update product stock
    for (const item of purchaseOrder.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.product.id },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product.id} not found`,
        );
      }
      product.stock += item.quantity;
      await this.productsRepository.save(product);
    }

    // Update purchase order status and received date
    purchaseOrder.status = 'received';
    purchaseOrder.received_date = new Date(
      receivePurchaseOrderDto.received_date,
    );
    const updatedPurchaseOrder =
      await this.purchaseOrdersRepository.save(purchaseOrder);

    return new ApiResponse<PurchaseOrder>({
      message: 'Purchase order received successfully',
      data: updatedPurchaseOrder,
    });
  }

  async cancelPurchaseOrder(id: string): Promise<ApiResponse<PurchaseOrder>> {
    const purchaseOrderResponse = await this.findPurchaseOrderById(id);
    const purchaseOrder = purchaseOrderResponse.data;

    if (purchaseOrder.status === 'received') {
      throw new BadRequestException('Cannot cancel a received purchase order');
    }

    if (purchaseOrder.status === 'cancelled') {
      throw new BadRequestException('Purchase order is already cancelled');
    }

    purchaseOrder.status = 'cancelled';
    const updatedPurchaseOrder =
      await this.purchaseOrdersRepository.save(purchaseOrder);

    return new ApiResponse<PurchaseOrder>({
      message: 'Purchase order cancelled successfully',
      data: updatedPurchaseOrder,
    });
  }
}
