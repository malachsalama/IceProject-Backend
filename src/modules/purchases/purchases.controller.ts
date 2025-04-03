import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSupplierDocs } from './docs/create-supplier.docs';
import { GetAllSuppliersDocs } from './docs/get-all-suppliers.docs';
import { GetSupplierByIdDocs } from './docs/get-supplier-by-id.docs';
import { UpdateSupplierDocs } from './docs/update-supplier.docs';
import { DeleteSupplierDocs } from './docs/delete-supplier.docs';
import { CreatePurchaseOrderDocs } from './docs/create-purchase-order.docs';
import { GetAllPurchaseOrdersDocs } from './docs/get-all-purchase-orders.docs';
import { GetPurchaseOrderByIdDocs } from './docs/get-purchase-order-by-id.docs';
import { ReceivePurchaseOrderDocs } from './docs/receive-purchase-order.docs';
import { CancelPurchaseOrderDocs } from './docs/cancel-purchase-order.docs';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.enums';

@ApiTags('Purchases')
@Controller('purchases')
@ApiBearerAuth()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  // Supplier Endpoints
  @Post('suppliers')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @CreateSupplierDocs.create()
  createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<ApiResponse<Supplier>> {
    return this.purchasesService.createSupplier(createSupplierDto);
  }

  @Get('suppliers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetAllSuppliersDocs.get()
  findAllSuppliers(): Promise<ApiResponse<Supplier[]>> {
    return this.purchasesService.findAllSuppliers();
  }

  @Get('suppliers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetSupplierByIdDocs.get()
  findSupplierById(@Param('id') id: string): Promise<ApiResponse<Supplier>> {
    return this.purchasesService.findSupplierById(id);
  }

  @Patch('suppliers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UpdateSupplierDocs.update()
  updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<ApiResponse<Supplier>> {
    return this.purchasesService.updateSupplier(id, updateSupplierDto);
  }

  @Delete('suppliers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @DeleteSupplierDocs.delete()
  deleteSupplier(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return this.purchasesService.deleteSupplier(id);
  }

  // Purchase Order Endpoints
  @Post('orders')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @CreatePurchaseOrderDocs.create()
  createPurchaseOrder(
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<ApiResponse<PurchaseOrder>> {
    return this.purchasesService.createPurchaseOrder(createPurchaseOrderDto);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetAllPurchaseOrdersDocs.get()
  findAllPurchaseOrders(): Promise<ApiResponse<PurchaseOrder[]>> {
    return this.purchasesService.findAllPurchaseOrders();
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @GetPurchaseOrderByIdDocs.get()
  findPurchaseOrderById(
    @Param('id') id: string,
  ): Promise<ApiResponse<PurchaseOrder>> {
    return this.purchasesService.findPurchaseOrderById(id);
  }

  @Patch('orders/:id/receive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ReceivePurchaseOrderDocs.receive()
  receivePurchaseOrder(
    @Param('id') id: string,
    @Body() receivePurchaseOrderDto: ReceivePurchaseOrderDto,
  ): Promise<ApiResponse<PurchaseOrder>> {
    return this.purchasesService.receivePurchaseOrder(
      id,
      receivePurchaseOrderDto,
    );
  }

  @Patch('orders/:id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @CancelPurchaseOrderDocs.cancel()
  cancelPurchaseOrder(
    @Param('id') id: string,
  ): Promise<ApiResponse<PurchaseOrder>> {
    return this.purchasesService.cancelPurchaseOrder(id);
  }
}
