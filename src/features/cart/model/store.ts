import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/entities/product';
import type { CartItemsMap } from '@/entities/cart';
import { STORAGE_KEYS } from '@/shared/config/constants';

export interface CartState {
  items: CartItemsMap;
  selectedItemIds: string[];
  addToCart: (product: Product, quantity?: number) => void;
  addItemsToCart: (items: Array<{ product: Product; quantity: number }>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (select?: boolean) => void;
  _syncSelection: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      selectedItemIds: [],
      _syncSelection: () => {
        const { items, selectedItemIds } = get();
        const itemIds = Object.keys(items);
        const newSelectedIds = selectedItemIds.filter((id) =>
          itemIds.includes(id)
        );
        if (newSelectedIds.length !== selectedItemIds.length) {
          set({ selectedItemIds: newSelectedIds });
        }
      },

      addItemsToCart: (items) => {
        const newCartItems = { ...get().items };
        items.forEach((item) => {
          const { product, quantity } = item;
          const existingItem = newCartItems[product.id];
          if (existingItem) {
            newCartItems[product.id] = {
              ...existingItem,
              quantity: existingItem.quantity + quantity,
            };
          } else {
            newCartItems[product.id] = { ...product, quantity };
          }
        });

        const newItemIds = items.map((item) => item.product.id);
        set((state) => ({
          items: newCartItems,
          selectedItemIds: [
            ...new Set([...state.selectedItemIds, ...newItemIds]),
          ],
        }));
      },

      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items[product.id];
        const newItems = { ...items };

        if (existingItem) {
          newItems[product.id] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          };
        } else {
          newItems[product.id] = { ...product, quantity };
        }

        set((state) => ({
          items: newItems,
          selectedItemIds: state.selectedItemIds.includes(product.id)
            ? state.selectedItemIds
            : [...state.selectedItemIds, product.id],
        }));
      },

      removeFromCart: (productId) => {
        const newItems = { ...get().items };
        delete newItems[productId];
        set({ items: newItems });
        get()._syncSelection();
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: {
            ...state.items,
            [productId]: { ...state.items[productId], quantity },
          },
        }));
      },

      clearCart: () => set({ items: {}, selectedItemIds: [] }),

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

        if (shouldSelect) {
          set({ selectedItemIds: allItemIds });
        } else {
          set({ selectedItemIds: [] });
        }
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
        state?._syncSelection();
      },
    }
  )
);
