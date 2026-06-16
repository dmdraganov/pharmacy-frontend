import { apiRequest, type ApiMeta } from './apiClient';
import type { Product } from '@/entities/product';

export interface ApiProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string | string[] | null;
  price: number | string;
  old_price?: number | string | null;
  is_popular?: boolean;
  is_prescription?: boolean;
  info?: Product['info'] | null;
  category_id?: number | string | null;
  brand_id?: number | string | null;
  manufacturer_id?: number | string | null;
  brand?: { name?: string } | string | null;
  manufacturer?: { name?: string } | string | null;
  image?: string | null;
  images?: Array<{ image_url?: string; url?: string; path?: string } | string>;
}

export interface ProductsParams {
  [key: string]: string | number | boolean | null | undefined;
  page?: number;
  per_page?: number;
  category_id?: string | number;
  brand_id?: string | number;
  manufacturer_id?: string | number;
  min_price?: number;
  max_price?: number;
  is_prescription?: boolean;
  sort?: string;
}

export interface PaginatedResult<T> {
  data: T;
  meta?: ApiMeta;
}

const FALLBACK_PRODUCT_IMAGE = 'product-placeholder.svg';

export const mapProduct = (product: ApiProduct): Product => {
  const categoryId = product.category_id ? String(product.category_id) : '';
  const firstImage = product.images?.[0];
  const image =
    product.image ||
    (typeof firstImage === 'string'
      ? firstImage
      : firstImage?.image_url || firstImage?.url || firstImage?.path) ||
    FALLBACK_PRODUCT_IMAGE;

  const description = Array.isArray(product.description)
    ? product.description
    : product.description
      ? [product.description]
      : undefined;

  return {
    id: String(product.id),
    name: product.name,
    brand:
      typeof product.brand === 'string'
        ? product.brand
        : product.brand?.name || '',
    brandId: product.brand_id ? String(product.brand_id) : undefined,
    manufacturerId: product.manufacturer_id
      ? String(product.manufacturer_id)
      : undefined,
    manufacturer:
      typeof product.manufacturer === 'string'
        ? product.manufacturer
        : product.manufacturer?.name || undefined,
    sectionId: '',
    categoryId,
    price: Number(product.price),
    oldPrice: product.old_price ? Number(product.old_price) : undefined,
    image,
    description,
    isPopular: Boolean(product.is_popular),
    isPrescription: Boolean(product.is_prescription),
    info: product.info || undefined,
  };
};

export const getProducts = async (
  params: ProductsParams = {}
): Promise<Product[]> => {
  const response = await apiRequest<ApiProduct[]>('/products', { params });
  return response.data.map(mapProduct);
};

export const getProductsPage = async (
  params: ProductsParams = {}
): Promise<PaginatedResult<Product[]>> => {
  const response = await apiRequest<ApiProduct[]>('/products', { params });
  return {
    data: response.data.map(mapProduct),
    meta: response.meta,
  };
};

export const getPopularProducts = async (): Promise<Product[]> => {
  const response = await apiRequest<ApiProduct[]>('/products/popular');
  return response.data.map(mapProduct);
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiRequest<ApiProduct>(`/products/${id}`);
  return mapProduct(response.data);
};

export const searchProducts = async (
  query: string,
  params: ProductsParams = {}
): Promise<Product[]> => {
  const response = await apiRequest<ApiProduct[]>('/search/products', {
    params: { ...params, query },
  });
  return response.data.map(mapProduct);
};
