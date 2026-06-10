import { apiRequest, getAuthToken } from './apiClient';

interface ApiFavorite {
  product_id?: string;
  productId?: string;
  id?: string;
}

export const getFavoriteIds = async (): Promise<string[]> => {
  if (!getAuthToken()) {
    return [];
  }

  const response = await apiRequest<ApiFavorite[]>('/favorites', {
    params: { per_page: 100 },
  });

  return response.data
    .map((favorite) => favorite.product_id || favorite.productId || favorite.id)
    .filter(Boolean) as string[];
};

export const addFavorite = async (productId: string): Promise<void> => {
  if (!getAuthToken()) {
    return;
  }

  await apiRequest<void>('/favorites', {
    method: 'POST',
    body: { product_id: productId },
  });
};

export const removeFavorite = async (productId: string): Promise<void> => {
  if (!getAuthToken()) {
    return;
  }

  await apiRequest<void>(`/favorites/${productId}`, { method: 'DELETE' });
};
