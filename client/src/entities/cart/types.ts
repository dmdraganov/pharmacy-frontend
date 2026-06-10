import type { Product } from '@/entities/product';

export interface CartItem extends Product {
  quantity: number;
}

export type CartItemsMap = {
  [productId: string]: CartItem;
};
