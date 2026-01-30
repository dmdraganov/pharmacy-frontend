import { createContext } from 'react';
import type { Product } from '@/entities/product/model';

export interface CartItem extends Product {
  quantity: number;
}

export type CartItemsMap = {
  [productId: string]: CartItem;
};

interface CartContextValue {
  cartItems: CartItemsMap;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getQuantityInCart: (productId: string) => number;
  totalItems: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined
);
