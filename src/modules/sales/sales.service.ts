import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiResponse } from '../../shared/types/response.type';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemsRepository: Repository<SaleItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createSale(createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>> {
    // Validate products and calculate total amount
    let total_amount = 0;
    const saleItems: SaleItem[] = [];

    for (const itemDto of createSaleDto.items) {
      const product = await this.productsRepository.findOne({
        where: { id: itemDto.product_id },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${itemDto.product_id} not found`,
        );
      }

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${itemDto.quantity}`,
        );
      }

      const unit_price = product.price;
      const subtotal = unit_price * itemDto.quantity;
      total_amount += subtotal;

      const saleItem = this.saleItemsRepository.create({
        product,
        quantity: itemDto.quantity,
        unit_price,
        subtotal,
      });
      saleItems.push(saleItem);
    }

    // Create the sale
    const sale = this.salesRepository.create({
      total_amount,
      customer_name: createSaleDto.customer_name,
      customer_phone: createSaleDto.customer_phone,
      items: saleItems,
    });

    const savedSale = await this.salesRepository.save(sale);

    // Update product stock
    for (const item of saleItems) {
      const product = await this.productsRepository.findOne({
        where: { id: item.product.id },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product.id} not found`,
        );
      }
      product.stock -= item.quantity;
      await this.productsRepository.save(product);
    }

    return new ApiResponse<Sale>({
      message: 'Sale created successfully',
      data: savedSale,
    });
  }

  async findAllSales(): Promise<ApiResponse<Sale[]>> {
    const sales = await this.salesRepository.find({
      relations: ['items', 'items.product'],
    });
    return new ApiResponse<Sale[]>({
      message:
        sales.length > 0 ? 'Sales retrieved successfully' : 'No sales found',
      data: sales,
    });
  }

  async findSaleById(id: string): Promise<ApiResponse<Sale>> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
    return new ApiResponse<Sale>({
      message: 'Sale retrieved successfully',
      data: sale,
    });
  }
}
