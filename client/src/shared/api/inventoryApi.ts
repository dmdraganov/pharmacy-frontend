import { apiRequest } from './apiClient';

export interface InventoryItem {
  productId: string;
  pharmacyId: string;
  stockQuantity: number;
  reservedQuantity: number;
  updatedAt?: string | null;
}

interface ApiInventoryItem {
  product_id: string;
  pharmacy_id: number | string;
  stock_quantity: number;
  reserved_quantity: number;
  updated_at?: string | null;
}

const mapInventoryItem = (item: ApiInventoryItem): InventoryItem => ({
  productId: item.product_id,
  pharmacyId: String(item.pharmacy_id),
  stockQuantity: item.stock_quantity,
  reservedQuantity: item.reserved_quantity,
  updatedAt: item.updated_at,
});

export const getAdminInventory = async (
  pharmacyId: string
): Promise<InventoryItem[]> => {
  const response = await apiRequest<ApiInventoryItem[]>('/admin/inventory', {
    params: { pharmacy_id: pharmacyId, per_page: 100 },
  });
  return response.data.map(mapInventoryItem);
};

export const updateAdminInventory = async (
  pharmacyId: string,
  productId: string,
  stockQuantity: number
): Promise<InventoryItem> => {
  const response = await apiRequest<ApiInventoryItem>(
    `/admin/inventory/${pharmacyId}/${productId}`,
    {
      method: 'PATCH',
      body: { stock_quantity: stockQuantity },
    }
  );
  return mapInventoryItem(response.data);
};
