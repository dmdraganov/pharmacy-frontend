import type { Product } from '@/entities/product';

export type OrderStatus =
  | 'new'
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

export interface OrderAddress {
  city: string;
  street: string;
  house: string;
  apartment: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryInfo: string; // Formatted address or pharmacy name for display
  deliveryAddress?: OrderAddress | null; // Structured address for courier
  paymentMethod: 'online' | 'on-receipt';
}
