import type { Product } from '@/entities/product';
import type { InventoryItem } from '@/shared/api';

export interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  oldPrice: string;
  categoryId: string;
  brandId: string;
  manufacturerId: string;
  stockQuantity: string;
  isPopular: boolean;
  isPrescription: boolean;
}

export interface SelectOption {
  id: string;
  name: string;
}

export type ProductInventoryMap = Map<string, InventoryItem>;

export type EditingProduct = Product | null;
