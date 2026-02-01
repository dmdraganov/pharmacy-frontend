import type { Product } from '@/entities/product';

export type OrderStatus =
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at the time of order
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}
