import { createContext } from 'react';
import type { Product } from '@/entities/product';

export interface CartItem extends Product {
  quantity: number;
}

export type CartItemsMap = {
  [productId: string]: CartItem;
};

interface CartContextValue {
  cartItems: CartItemsMap;
  selectedItemIds: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getQuantityInCart: (productId: string) => number;
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (select?: boolean) => void;
  totalItems: number;
  selectedItemsCount: number;
  selectedItemsTotal: number;
  selectedItemsOriginalTotal: number;
  selectedItemsDiscount: number;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);
