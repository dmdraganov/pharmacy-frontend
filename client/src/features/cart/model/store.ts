import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/entities/product';
import type { CartItemsMap } from '@/entities/cart';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface CartState {
  items: CartItemsMap;
  selectedItemIds: string[];
  addToCart: (product: Product, quantity?: number) => void;
  addItemsToCart: (
    items: Array<{ product: Product; quantity: number }>
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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

      addItemsToCart: (items) => {
        get()._addOrUpdateItems(items);
      },

      addToCart: (product, quantity = 1) => {
        get()._addOrUpdateItems([{ product, quantity }]);
      },

      removeFromCart: (productId) => {
        const newItems = { ...get().items };
        delete newItems[productId];
        set({ items: newItems });
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
