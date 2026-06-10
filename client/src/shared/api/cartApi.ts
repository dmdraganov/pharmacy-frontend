import { apiRequest, getAuthToken } from './apiClient';
import { getProductById } from './productsApi';
import type { CartItem, CartItemsMap } from '@/entities/cart';
import type { Product } from '@/entities/product';

interface ApiCartItem {
  id: number | string;
  product_id: string;
  quantity: number;
}

export const getCartItems = async (): Promise<CartItemsMap> => {
  if (!getAuthToken()) {
    return {};
  }

  const response = await apiRequest<ApiCartItem[]>('/cart', {
    params: { per_page: 100 },
  });

  const productItems = await Promise.all(
    response.data.map(async (item): Promise<CartItem | null> => {
      try {
        const product = await getProductById(item.product_id);
        return {
          ...product,
          cartItemId: String(item.id),
          quantity: item.quantity,
        };
      } catch (_error) {
        return null;
      }
    })
  );

  return productItems.reduce<CartItemsMap>((acc, item) => {
    if (item) {
      acc[item.id] = item;
    }
    return acc;
  }, {});
};

export const addCartItem = async (
  product: Product,
  quantity = 1
): Promise<void> => {
  if (!getAuthToken()) {
    return;
  }

  await apiRequest<void>('/cart', {
    method: 'POST',
    body: { product_id: product.id, quantity },
  });
};

export const updateCartItem = async (
  cartItemId: string,
  quantity: number
): Promise<void> => {
  if (!getAuthToken()) {
    return;
  }

  await apiRequest<void>(`/cart/${cartItemId}`, {
    method: 'PATCH',
    body: { quantity },
  });
};

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  if (!getAuthToken()) {
    return;
  }

  await apiRequest<void>(`/cart/${cartItemId}`, { method: 'DELETE' });
};

export const clearCartItems = async (): Promise<void> => {
  if (!getAuthToken()) {
    return;
  }

  await apiRequest<void>('/cart', { method: 'DELETE' });
};
