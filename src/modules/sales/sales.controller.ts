import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApiResponse } from '../../shared/types/response.type';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSaleDocs } from './docs/create-sale.docs';
import { GetAllSalesDocs } from './docs/get-all-sales.docs';
import { GetSaleByIdDocs } from './docs/get-sale-by-id.docs';
import { Sale } from './entities/sale.entity';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.enums';

@ApiTags('sales')
@Controller('sales')
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CASHIER, UserRole.ADMIN) // Only cashiers and admins can create sales
  @CreateSaleDocs.create()
  createSale(@Body() createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>> {
    return this.salesService.createSale(createSaleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can view all sales
  @GetAllSalesDocs.get()
  findAllSales(): Promise<ApiResponse<Sale[]>> {
    return this.salesService.findAllSales();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can view a specific sale
  @GetSaleByIdDocs.get()
  findSaleById(@Param('id') id: string): Promise<ApiResponse<Sale>> {
    return this.salesService.findSaleById(id);
  }
}
