import { Product } from '../../products/entities/product.entity';

export interface InventoryReport {
  total_products: number;
  total_stock: number;
  low_stock_products: Array<{
    product_id: string;
    product_name: string;
    stock: number;
  }>;
  products: Product[];
}
