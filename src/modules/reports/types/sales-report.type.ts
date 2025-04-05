import { Sale } from '../../sales/entities/sale.entity';

export interface SalesReport {
  total_sales: number;
  total_amount: number;
  top_products: Array<{
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_amount: number;
  }>;
  sales: Sale[];
}
