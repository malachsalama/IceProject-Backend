import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryAdjustmentDto } from './dto/create-inventory-adjustment.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAdjustmentDocs } from './docs/create-adjustment.docs';
import { GetAllAdjustmentsDocs } from './docs/get-all-adjustments.docs';
import { GetAdjustmentByIdDocs } from './docs/get-adjustment-by-id.docs';
import { GetProductInventoryHistoryDocs } from './docs/get-product-inventory-history.docs';
import { InventoryAdjustment } from './entities/inventory-adjustment.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.enums';

@ApiTags('Inventory')
@Controller('inventory')
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('adjustments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @CreateAdjustmentDocs.create()
  createAdjustment(
    @Body() createInventoryAdjustmentDto: CreateInventoryAdjustmentDto,
  ): Promise<ApiResponse<InventoryAdjustment>> {
    return this.inventoryService.createAdjustment(createInventoryAdjustmentDto);
  }

  @Get('adjustments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetAllAdjustmentsDocs.get()
  findAllAdjustments(): Promise<ApiResponse<InventoryAdjustment[]>> {
    return this.inventoryService.findAllAdjustments();
  }

  @Get('adjustments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetAdjustmentByIdDocs.get()
  findAdjustmentById(
    @Param('id') id: string,
  ): Promise<ApiResponse<InventoryAdjustment>> {
    return this.inventoryService.findAdjustmentById(id);
  }

  @Get('products/:productId/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetProductInventoryHistoryDocs.get()
  findProductInventoryHistory(
    @Param('productId') productId: string,
  ): Promise<ApiResponse<InventoryAdjustment[]>> {
    return this.inventoryService.findProductInventoryHistory(productId);
  }
}
