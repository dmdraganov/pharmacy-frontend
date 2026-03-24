import { useMemo } from 'react';
import { useCartStore } from './store';
import type { CartItem } from '@/entities/cart';

/**
 * Hook for components that need the list of cart items.
 */
export const useCartItems = () => useCartStore((state) => state.items);

/**
 * Hook for components that need the list of selected item IDs.
 */
export const useSelectedItemIds = () =>
  useCartStore((state) => state.selectedItemIds);

/**
 * Hook to get the quantity of a specific product in the cart.
 */
export const useCartItemQuantity = (productId: string) => {
  return useCartStore((state) => state.items[productId]?.quantity || 0);
};

/**
 * Hook for components that need calculated totals and counts for all items.
 */
export const useAllCartTotals = () => {
  const items = useCartItems();

  const totalItems = useMemo(() => {
    return Object.values(items).reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0,
    );
  }, [items]);

  const total = useMemo(() => {
    return Object.values(items).reduce(
      (acc: number, item: CartItem) => acc + item.price * item.quantity,
      0,
    );
  }, [items]);

  return {
    totalItems,
    total,
  };
};

/**
 * Hook for components that need calculated totals and counts.
 */
export const useCartTotals = () => {
  const items = useCartItems();
  const selectedItemIds = useSelectedItemIds();

  const totalItems = useMemo(() => {
    return Object.values(items).reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0,
    );
  }, [items]);

  const selectedItemsCount = useMemo(() => {
    return selectedItemIds.reduce(
      (acc: number, id: string) => acc + (items[id]?.quantity || 0),
      0,
    );
  }, [selectedItemIds, items]);

  const selectedItemsTotal = useMemo(() => {
    return selectedItemIds.reduce(
      (acc: number, id: string) =>
        acc + (items[id]?.price || 0) * (items[id]?.quantity || 0),
      0,
    );
  }, [selectedItemIds, items]);

  const selectedItemsOriginalTotal = useMemo(() => {
    return selectedItemIds.reduce((acc: number, id: string) => {
      const item = items[id];
      if (!item) return acc;
      const price = item.oldPrice ?? item.price;
      return acc + price * item.quantity;
    }, 0);
  }, [selectedItemIds, items]);

  const selectedItemsDiscount = useMemo(
    () => selectedItemsOriginalTotal - selectedItemsTotal,
    [selectedItemsOriginalTotal, selectedItemsTotal],
  );

  return {
    totalItems,
    selectedItemsCount,
    selectedItemsTotal,
    selectedItemsOriginalTotal,
    selectedItemsDiscount,
  };
};
