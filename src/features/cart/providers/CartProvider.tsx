import { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CartContext, type CartItemsMap, type CartItem } from '@/features/cart';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Product } from '@/entities/product/model';
import { STORAGE_KEYS } from '@/shared/config/constants';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItemsMap>(
    STORAGE_KEYS.CART,
    {}
  );

  const addToCart = useCallback(
    (product: Product) => {
      setCartItems((prevItems: CartItemsMap) => {
        const existingItem = prevItems[product.id];
        const newItems = { ...prevItems };
        if (existingItem) {
          newItems[product.id] = {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          };
        } else {
          newItems[product.id] = { ...product, quantity: 1 };
        }
        return newItems;
      });
    },
    [setCartItems]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCartItems((prevItems: CartItemsMap) => {
        const newItems = { ...prevItems };
        delete newItems[productId];
        return newItems;
      });
    },
    [setCartItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prevItems: CartItemsMap) => {
        const newItems = { ...prevItems };
        if (newItems[productId]) {
          newItems[productId] = { ...newItems[productId], quantity };
        }
        return newItems;
      });
    },
    [setCartItems, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems({});
  }, [setCartItems]);

  const getQuantityInCart = useCallback(
    (productId: string) => {
      return cartItems[productId]?.quantity || 0;
    },
    [cartItems]
  );

  const totalItems = useMemo(() => {
    return Object.values(cartItems).reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0
    );
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return Object.values(cartItems).reduce(
      (acc: number, item: CartItem) => acc + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getQuantityInCart,
    totalItems,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
