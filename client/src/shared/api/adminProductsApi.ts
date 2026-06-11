import { apiRequest } from './apiClient';
import { mapProduct, type ApiProduct } from './productsApi';
import type { Product } from '@/entities/product';

export interface AdminProductPayload {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  old_price?: number | null;
  is_popular: boolean;
  is_prescription: boolean;
  category_id: number;
  brand_id: number;
  manufacturer_id: number;
}

export const createAdminProduct = async (
  payload: AdminProductPayload
): Promise<Product> => {
  const response = await apiRequest<ApiProduct>('/admin/products', {
    method: 'POST',
    body: payload,
  });
  return mapProduct(response.data);
};

export const updateAdminProduct = async (
  id: string,
  payload: AdminProductPayload
): Promise<Product> => {
  const response = await apiRequest<ApiProduct>(`/admin/products/${id}`, {
    method: 'PUT',
    body: payload,
  });
  return mapProduct(response.data);
};

export const deleteAdminProduct = async (id: string): Promise<void> => {
  await apiRequest<void>(`/admin/products/${id}`, { method: 'DELETE' });
};
