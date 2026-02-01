import { useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CartContext, type CartItemsMap, type CartItem } from '@/features/cart';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Product } from '@/entities/product';
import { STORAGE_KEYS } from '@/shared/config/constants';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItemsMap>(
    STORAGE_KEYS.CART,
    {}
  );
  const [selectedItemIds, setSelectedItemIds] = useLocalStorage<string[]>(
    STORAGE_KEYS.CART_SELECTION,
    []
  );

  useEffect(() => {
    // Sync selection with cart items.
    // This removes selected IDs that are no longer in the cart.
    const cartItemIds = Object.keys(cartItems);
    const newSelectedIds = selectedItemIds.filter((id) =>
      cartItemIds.includes(id)
    );

    if (newSelectedIds.length !== selectedItemIds.length) {
      setSelectedItemIds(newSelectedIds);
    }
  }, [cartItems, selectedItemIds, setSelectedItemIds]);

  const toggleSelectItem = useCallback(
    (productId: string) => {
      setSelectedItemIds((prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId)
          : [...prevSelected, productId]
      );
    },
    [setSelectedItemIds]
  );

  const toggleSelectAll = useCallback(
    (forceSelect?: boolean) => {
      const allItemIds = Object.keys(cartItems);
      const areAllItemsSelected =
        selectedItemIds.length === allItemIds.length && allItemIds.length > 0;

      const shouldSelect = forceSelect ?? !areAllItemsSelected;

      if (shouldSelect) {
        setSelectedItemIds(allItemIds);
      } else {
        setSelectedItemIds([]);
      }
    },
    [cartItems, selectedItemIds, setSelectedItemIds]
  );

  const addToCart = useCallback(
    (product: Product) => {
      const isNewItem = !cartItems[product.id];
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
      if (isNewItem) {
        setSelectedItemIds((prevSelected) => [...prevSelected, product.id]);
      }
    },
    [cartItems, setCartItems, setSelectedItemIds]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCartItems((prevItems: CartItemsMap) => {
        const newItems = { ...prevItems };
        delete newItems[productId];
        return newItems;
      });
      setSelectedItemIds((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    },
    [setCartItems, setSelectedItemIds]
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
    setSelectedItemIds([]);
  }, [setCartItems, setSelectedItemIds]);

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

  const selectedItemsCount = useMemo(() => {
    return selectedItemIds.reduce(
      (acc, id) => acc + (cartItems[id]?.quantity || 0),
      0
    );
  }, [selectedItemIds, cartItems]);

  const selectedItemsTotal = useMemo(() => {
    return selectedItemIds.reduce(
      (acc, id) =>
        acc + (cartItems[id]?.price || 0) * (cartItems[id]?.quantity || 0),
      0
    );
  }, [selectedItemIds, cartItems]);

  const selectedItemsOriginalTotal = useMemo(() => {
    return selectedItemIds.reduce((acc, id) => {
      const item = cartItems[id];
      if (!item) return acc;
      const price = item.oldPrice ?? item.price;
      return acc + price * item.quantity;
    }, 0);
  }, [selectedItemIds, cartItems]);

  const selectedItemsDiscount = useMemo(
    () => selectedItemsOriginalTotal - selectedItemsTotal,
    [selectedItemsOriginalTotal, selectedItemsTotal]
  );

  const value = useMemo(
    () => ({
      cartItems,
      selectedItemIds,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getQuantityInCart,
      toggleSelectItem,
      toggleSelectAll,
      totalItems,
      selectedItemsCount,
      selectedItemsTotal,
      selectedItemsOriginalTotal,
      selectedItemsDiscount,
    }),
    [
      cartItems,
      selectedItemIds,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getQuantityInCart,
      toggleSelectItem,
      toggleSelectAll,
      totalItems,
      selectedItemsCount,
      selectedItemsTotal,
      selectedItemsOriginalTotal,
      selectedItemsDiscount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
