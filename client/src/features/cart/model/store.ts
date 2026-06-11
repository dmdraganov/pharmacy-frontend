import { create } from 'zustand';
import type { StoreApi } from 'zustand';
import type { Product } from '@/entities/product';
import type { CartItemsMap } from '@/entities/cart';
import * as cartApi from '@/shared/api/cartApi';
import { createKeyedDebounce } from '@/shared/lib/createKeyedDebounce';

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

const debouncedUpdateQuantity = createKeyedDebounce(
  async (
    productId: string,
    getState: () => CartState,
    setState: StoreApi<CartState>['setState']
  ) => {
    const latestItem = getState().items[productId];
    if (!latestItem?.cartItemId) return;

    const cartItem = await cartApi.updateCartItem(
      latestItem.cartItemId,
      latestItem.quantity
    );
    setState((state) => ({
      items: {
        ...state.items,
        [productId]: {
          ...state.items[productId],
          cartItemId: String(cartItem.id),
          quantity: cartItem.quantity,
        },
      },
    }));
  },
  1000
);

export const useCartStore = create<CartState>()((set, get) => ({
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
      selectedItemIds: [...new Set([...state.selectedItemIds, ...newItemIds])],
    }));
  },

  addItemsToCart: async (items) => {
    get()._addOrUpdateItems(items);
    const savedItems = await Promise.all(
      items.map((item) =>
        cartApi.addCartItem(item.product, item.quantity).then((cartItem) => ({
          productId: item.product.id,
          cartItem,
        }))
      )
    );
    set((state) => {
      const nextItems = { ...state.items };
      savedItems.forEach(({ productId, cartItem }) => {
        if (nextItems[productId]) {
          nextItems[productId] = {
            ...nextItems[productId],
            cartItemId: String(cartItem.id),
            quantity: cartItem.quantity,
          };
        }
      });

      return { items: nextItems };
    });
  },

  addToCart: async (product, quantity = 1) => {
    get()._addOrUpdateItems([{ product, quantity }]);
    const cartItem = await cartApi.addCartItem(product, quantity);
    set((state) => ({
      items: {
        ...state.items,
        [product.id]: {
          ...state.items[product.id],
          cartItemId: String(cartItem.id),
          quantity: cartItem.quantity,
        },
      },
    }));
  },

  removeFromCart: async (productId) => {
    debouncedUpdateQuantity.cancel(productId);

    const cartItemId = get().items[productId]?.cartItemId;
    const newItems = { ...get().items };
    delete newItems[productId];
    set({ items: newItems });
    if (cartItemId) {
      await cartApi.removeCartItem(cartItemId);
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
    if (!cartItemId) return;

    debouncedUpdateQuantity(productId, get, set);
  },

  clearCart: async () => {
    debouncedUpdateQuantity.cancelAll();
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
}));

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
