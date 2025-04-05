import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SalesReportDocs } from './docs/sales-report.docs';
import { InventoryReportDocs } from './docs/inventory-report.docs';
import { PurchaseReportDocs } from './docs/purchase-report.docs';
import { SalesReport } from './types/sales-report.type';
import { InventoryReport } from './types/inventory-report.type';
import { PurchaseReport } from './types/purchase-report.type';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.enums';

@ApiTags('Reports')
@Controller('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @SalesReportDocs.get()
  generateSalesReport(
    @Query() filter: ReportFilterDto,
  ): Promise<ApiResponse<SalesReport>> {
    return this.reportsService.generateSalesReport(filter);
  }

  @Get('inventory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @InventoryReportDocs.get()
  generateInventoryReport(): Promise<ApiResponse<InventoryReport>> {
    return this.reportsService.generateInventoryReport();
  }

  @Get('purchases')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @PurchaseReportDocs.get()
  generatePurchaseReport(
    @Query() filter: ReportFilterDto,
  ): Promise<ApiResponse<PurchaseReport>> {
    return this.reportsService.generatePurchaseReport(filter);
  }
}
