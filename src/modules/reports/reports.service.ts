import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';
import { ReportFilterDto } from './dto/report-filter.dto';
import { SalesReport } from './types/sales-report.type';
import { InventoryReport } from './types/inventory-report.type';
import { PurchaseReport } from './types/purchase-report.type';
import { ApiResponse } from '../../shared/types/response.type';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemsRepository: Repository<SaleItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrdersRepository: Repository<PurchaseOrder>,
  ) {}

  async generateSalesReport(
    filter: ReportFilterDto,
  ): Promise<ApiResponse<SalesReport>> {
    const { start_date, end_date } = filter;

    // Validate date range
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      throw new BadRequestException(
        'start_date cannot be greater than end_date',
      );
    }

    // Build query conditions
    const where: any = {};
    if (start_date || end_date) {
      where.created_at = Between(
        start_date ? new Date(start_date) : new Date('2024-01-01'),
        end_date ? new Date(end_date) : new Date(),
      );
    }

    // Fetch sales
    const sales = await this.salesRepository.find({
      where,
      relations: ['items', 'items.product'],
    });

    // Calculate total sales and total amount
    const total_sales = sales.length;
    const total_amount = sales.reduce(
      (sum, sale) => sum + Number(sale.total_amount),
      0,
    );

    // Calculate top products
    const productSales: {
      [key: string]: {
        product_id: string;
        product_name: string;
        total_quantity: number;
        total_amount: number;
      };
    } = {};
    for (const sale of sales) {
      for (const item of sale.items) {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            product_id: productId,
            product_name: item.product.name,
            total_quantity: 0,
            total_amount: 0,
          };
        }
        productSales[productId].total_quantity += item.quantity;
        productSales[productId].total_amount += Number(item.subtotal);
      }
    }

    const top_products = Object.values(productSales)
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5); // Top 5 products

    const report: SalesReport = {
      total_sales,
      total_amount,
      top_products,
      sales,
    };

    return new ApiResponse<SalesReport>({
      message: 'Sales report generated successfully',
      data: report,
    });
  }

  async generateInventoryReport(): Promise<ApiResponse<InventoryReport>> {
    // Fetch all products
    const products = await this.productsRepository.find();

    // Calculate total products and total stock
    const total_products = products.length;
    const total_stock = products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );

    // Identify low stock products (stock < 10)
    const low_stock_products = products
      .filter((product) => product.stock < 10)
      .map((product) => ({
        product_id: product.id,
        product_name: product.name,
        stock: product.stock,
      }));

    const report: InventoryReport = {
      total_products,
      total_stock,
      low_stock_products,
      products,
    };

    return new ApiResponse<InventoryReport>({
      message: 'Inventory report generated successfully',
      data: report,
    });
  }

  async generatePurchaseReport(
    filter: ReportFilterDto,
  ): Promise<ApiResponse<PurchaseReport>> {
    const { start_date, end_date } = filter;

    // Validate date range
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      throw new BadRequestException(
        'start_date cannot be greater than end_date',
      );
    }

    // Build query conditions
    const where: any = {};
    if (start_date || end_date) {
      where.order_date = Between(
        start_date ? new Date(start_date) : new Date('2024-01-01'),
        end_date ? new Date(end_date) : new Date(),
      );
    }

    // Fetch purchase orders
    const purchase_orders = await this.purchaseOrdersRepository.find({
      where,
      relations: ['supplier', 'items', 'items.product'],
    });

    // Calculate total purchase orders and total amount
    const total_purchase_orders = purchase_orders.length;
    const total_amount = purchase_orders.reduce(
      (sum, order) => sum + Number(order.total_amount),
      0,
    );

    // Calculate pending orders
    const pending_orders = purchase_orders.filter(
      (order) => order.status === 'pending',
    ).length;

    // Calculate supplier summary
    const supplierSummary: {
      [key: string]: {
        supplier_id: string;
        supplier_name: string;
        total_orders: number;
        total_amount: number;
      };
    } = {};
    for (const order of purchase_orders) {
      const supplierId = order.supplier.id;
      if (!supplierSummary[supplierId]) {
        supplierSummary[supplierId] = {
          supplier_id: supplierId,
          supplier_name: order.supplier.name,
          total_orders: 0,
          total_amount: 0,
        };
      }
      supplierSummary[supplierId].total_orders += 1;
      supplierSummary[supplierId].total_amount += Number(order.total_amount);
    }

    const supplier_summary = Object.values(supplierSummary);

    const report: PurchaseReport = {
      total_purchase_orders,
      total_amount,
      pending_orders,
      supplier_summary,
      purchase_orders,
    };

    return new ApiResponse<PurchaseReport>({
      message: 'Purchase report generated successfully',
      data: report,
    });
  }
}
