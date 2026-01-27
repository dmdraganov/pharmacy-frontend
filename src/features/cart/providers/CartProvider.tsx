import { useCallback } from 'react';
import type { ReactNode } from 'react';
import { CartContext, type CartItem } from '@/features/cart';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Product } from '@/entities/product/model';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = useCallback(
    (product: Product) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      });
    },
    [setItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    },
    [setItems, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
