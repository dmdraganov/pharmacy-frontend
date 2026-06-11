import { ApiError, apiRequest } from './apiClient';
import { getProductById, mapProduct, type ApiProduct } from './productsApi';
import type { CartItem, CartItemsMap } from '@/entities/cart';
import type { Product } from '@/entities/product';

interface ApiCartItem {
  id: number | string;
  product_id: string;
  quantity: number;
  product?: ApiProduct | null;
}

export const getCartItems = async (): Promise<CartItemsMap> => {
  const response = await apiRequest<ApiCartItem[]>('/cart', {
    params: { per_page: 100 },
  }).catch((error) => {
    if (error instanceof ApiError && error.status === 401) {
      return { data: [], message: 'Unauthenticated' };
    }

    throw error;
  });

  const productItems = await Promise.all(
    response.data.map(async (item): Promise<CartItem | null> => {
      try {
        const product = item.product
          ? mapProduct(item.product)
          : await getProductById(item.product_id);
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
): Promise<ApiCartItem> => {
  const response = await apiRequest<ApiCartItem>('/cart', {
    method: 'POST',
    body: { product_id: product.id, quantity },
  });

  return response.data;
};

export const updateCartItem = async (
  cartItemId: string,
  quantity: number
): Promise<ApiCartItem> => {
  const response = await apiRequest<ApiCartItem>(`/cart/${cartItemId}`, {
    method: 'PATCH',
    body: { quantity },
  });

  return response.data;
};

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  await apiRequest<void>(`/cart/${cartItemId}`, { method: 'DELETE' });
};

export const clearCartItems = async (): Promise<void> => {
  await apiRequest<void>('/cart', { method: 'DELETE' });
};
