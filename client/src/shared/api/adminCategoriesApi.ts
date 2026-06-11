import { apiRequest } from './apiClient';
import type { Category } from '@/entities/section';

export interface AdminCategoryPayload {
  name: string;
  description?: string | null;
  section_id: number;
}

interface ApiAdminCategory {
  id: number | string;
  name: string;
  section_id?: number | string | null;
}

const mapAdminCategory = (category: ApiAdminCategory): Category => ({
  id: String(category.id),
  name: category.name,
  sectionId: category.section_id ? String(category.section_id) : '',
});

export const createAdminCategory = async (
  payload: AdminCategoryPayload
): Promise<Category> => {
  const response = await apiRequest<ApiAdminCategory>('/admin/categories', {
    method: 'POST',
    body: payload,
  });
  return mapAdminCategory(response.data);
};

export const updateAdminCategory = async (
  id: string,
  payload: AdminCategoryPayload
): Promise<Category> => {
  const response = await apiRequest<ApiAdminCategory>(
    `/admin/categories/${id}`,
    {
      method: 'PUT',
      body: payload,
    }
  );
  return mapAdminCategory(response.data);
};

export const deleteAdminCategory = async (id: string): Promise<void> => {
  await apiRequest<void>(`/admin/categories/${id}`, { method: 'DELETE' });
};
