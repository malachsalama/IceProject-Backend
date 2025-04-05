import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Sale } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { Product } from '../products/entities/product.entity';
import { PurchaseOrder } from '../purchases/entities/purchase-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem, Product, PurchaseOrder])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
