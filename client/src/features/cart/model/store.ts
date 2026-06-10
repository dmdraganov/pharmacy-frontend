import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/entities/product';
import type { CartItemsMap } from '@/entities/cart';
import { STORAGE_KEYS } from '@/shared/config/constants';
import * as cartApi from '@/shared/api/cartApi';

interface CartState {
  items: CartItemsMap;
  selectedItemIds: string[];
  syncCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  addItemsToCart: (
    items: Array<{ product: Product; quantity: number }>
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (select?: boolean) => void;
  _addOrUpdateItems: (
    itemsToAdd: Array<{ product: Product; quantity: number }>
  ) => void;
}

const syncSelection = (
  items: CartItemsMap,
  selectedItemIds: string[]
): string[] => {
  const itemIds = Object.keys(items);
  const newSelectedIds = selectedItemIds.filter((id) => itemIds.includes(id));
  return newSelectedIds.length !== selectedItemIds.length
    ? newSelectedIds
    : selectedItemIds;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      selectedItemIds: [],

      syncCart: async () => {
        const items = await cartApi.getCartItems();
        set((state) => ({
          items,
          selectedItemIds:
            state.selectedItemIds.length > 0
              ? syncSelection(items, state.selectedItemIds)
              : Object.keys(items),
        }));
      },

      _addOrUpdateItems: (
        itemsToAdd: Array<{ product: Product; quantity: number }>
      ) => {
        const newCartItems = { ...get().items };
        const newItemIds: string[] = [];

        itemsToAdd.forEach((item) => {
          const { product, quantity } = item;
          const existingItem = newCartItems[product.id];
          newItemIds.push(product.id);
          if (existingItem) {
            newCartItems[product.id] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
            };
          } else {
            newCartItems[product.id] = { ...product, quantity };
          }
        });

        set((state) => ({
          items: newCartItems,
          selectedItemIds: [
            ...new Set([...state.selectedItemIds, ...newItemIds]),
          ],
        }));
      },

      addItemsToCart: async (items) => {
        get()._addOrUpdateItems(items);
        await Promise.all(
          items.map((item) => cartApi.addCartItem(item.product, item.quantity))
        );
        await get().syncCart();
      },

      addToCart: async (product, quantity = 1) => {
        get()._addOrUpdateItems([{ product, quantity }]);
        await cartApi.addCartItem(product, quantity);
        await get().syncCart();
      },

      removeFromCart: async (productId) => {
        const cartItemId = get().items[productId]?.cartItemId;
        const newItems = { ...get().items };
        delete newItems[productId];
        set({ items: newItems });
        if (cartItemId) {
          await cartApi.removeCartItem(cartItemId);
          await get().syncCart();
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          await get().removeFromCart(productId);
          return;
        }
        const cartItemId = get().items[productId]?.cartItemId;
        set((state) => ({
          items: {
            ...state.items,
            [productId]: { ...state.items[productId], quantity },
          },
        }));
        if (cartItemId) {
          await cartApi.updateCartItem(cartItemId, quantity);
          await get().syncCart();
        }
      },

      clearCart: async () => {
        set({ items: {}, selectedItemIds: [] });
        await cartApi.clearCartItems();
      },

      toggleSelectItem: (productId) =>
        set((state) => ({
          selectedItemIds: state.selectedItemIds.includes(productId)
            ? state.selectedItemIds.filter((id) => id !== productId)
            : [...state.selectedItemIds, productId],
        })),

      toggleSelectAll: (forceSelect) => {
        const { items, selectedItemIds } = get();
        const allItemIds = Object.keys(items);
        const areAllSelected = selectedItemIds.length === allItemIds.length;
        const shouldSelect = forceSelect ?? !areAllSelected;

        set({ selectedItemIds: shouldSelect ? allItemIds : [] });
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        selectedItemIds: state.selectedItemIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const newSelectedIds = syncSelection(
            state.items,
            state.selectedItemIds
          );
          state.selectedItemIds = newSelectedIds;
        }
      },
    }
  )
);

let previousItems = useCartStore.getState().items;

useCartStore.subscribe((state) => {
  const currentItems = state.items;
  if (currentItems !== previousItems) {
    const { selectedItemIds } = state;
    const newSelectedIds = syncSelection(currentItems, selectedItemIds);
    if (newSelectedIds !== selectedItemIds) {
      useCartStore.setState({ selectedItemIds: newSelectedIds });
    }
  }
  previousItems = currentItems;
});
