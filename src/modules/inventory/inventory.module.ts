import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryAdjustment, Product])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
