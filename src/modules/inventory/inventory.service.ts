import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInventoryAdjustmentDto } from './dto/create-inventory-adjustment.dto';
import { ApiResponse } from '../../shared/types/response.type';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryAdjustment)
    private inventoryAdjustmentsRepository: Repository<InventoryAdjustment>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createAdjustment(
    createInventoryAdjustmentDto: CreateInventoryAdjustmentDto,
  ): Promise<ApiResponse<InventoryAdjustment>> {
    // Validate product
    const product = await this.productsRepository.findOne({
      where: { id: createInventoryAdjustmentDto.product_id },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createInventoryAdjustmentDto.product_id} not found`,
      );
    }

    // Update product stock based on adjustment type
    if (createInventoryAdjustmentDto.adjustment_type === 'increase') {
      product.stock += createInventoryAdjustmentDto.quantity;
    } else if (createInventoryAdjustmentDto.adjustment_type === 'decrease') {
      if (product.stock < createInventoryAdjustmentDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested to decrease: ${createInventoryAdjustmentDto.quantity}`,
        );
      }
      product.stock -= createInventoryAdjustmentDto.quantity;
    }

    // Save the updated product stock
    await this.productsRepository.save(product);

    // Create the inventory adjustment record
    const adjustment = this.inventoryAdjustmentsRepository.create({
      product,
      quantity: createInventoryAdjustmentDto.quantity,
      adjustment_type: createInventoryAdjustmentDto.adjustment_type,
      reason: createInventoryAdjustmentDto.reason,
    });

    const savedAdjustment =
      await this.inventoryAdjustmentsRepository.save(adjustment);
    return new ApiResponse<InventoryAdjustment>({
      message: 'Inventory adjustment created successfully',
      data: savedAdjustment,
    });
  }

  async findAllAdjustments(): Promise<ApiResponse<InventoryAdjustment[]>> {
    const adjustments = await this.inventoryAdjustmentsRepository.find({
      relations: ['product'],
    });
    return new ApiResponse<InventoryAdjustment[]>({
      message:
        adjustments.length > 0
          ? 'Inventory adjustments retrieved successfully'
          : 'No adjustments found',
      data: adjustments,
    });
  }

  async findAdjustmentById(
    id: string,
  ): Promise<ApiResponse<InventoryAdjustment>> {
    const adjustment = await this.inventoryAdjustmentsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!adjustment)
      throw new NotFoundException(
        `Inventory adjustment with ID ${id} not found`,
      );
    return new ApiResponse<InventoryAdjustment>({
      message: 'Inventory adjustment retrieved successfully',
      data: adjustment,
    });
  }

  async findProductInventoryHistory(
    productId: string,
  ): Promise<ApiResponse<InventoryAdjustment[]>> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const adjustments = await this.inventoryAdjustmentsRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
      order: { created_at: 'DESC' },
    });

    return new ApiResponse<InventoryAdjustment[]>({
      message:
        adjustments.length > 0
          ? 'Inventory history retrieved successfully'
          : 'No inventory history found',
      data: adjustments,
    });
  }
}
