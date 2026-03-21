import { createContext } from 'react';
import type { Product } from '@/entities/product';
import type { CartItemsMap } from '@/entities/cart';

interface CartContextValue {
  cartItems: CartItemsMap;
  selectedItemIds: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addItemsToCart: (
    items: Array<{ product: Product; quantity: number }>
  ) => void;
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
