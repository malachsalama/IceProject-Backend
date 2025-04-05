import { PurchaseOrder } from '../../purchases/entities/purchase-order.entity';

export interface PurchaseReport {
  total_purchase_orders: number;
  total_amount: number;
  pending_orders: number;
  supplier_summary: Array<{
    supplier_id: string;
    supplier_name: string;
    total_orders: number;
    total_amount: number;
  }>;
  purchase_orders: PurchaseOrder[];
}
