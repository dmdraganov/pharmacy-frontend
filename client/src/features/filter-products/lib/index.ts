import type { Product } from '@/entities/product';
import type { FilterParams } from '../model/useFilters';

export type AvailableFilters = {
  minPrice: number;
  maxPrice: number;
  isPrescription: boolean;
};

export const getAvailableFilters = (products: Product[]): AvailableFilters => {
  if (products.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      isPrescription: false,
    };
  }

  const prices = products.map((p) => p.price);
  const isPrescription = products.some((p) => p.isPrescription);

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    isPrescription,
  };
};

export const applyFilters = (
  products: Product[],
  filters: FilterParams
): Product[] => {
  let filteredProducts = products;

  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= filters.minPrice!
    );
  }
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= filters.maxPrice!
    );
  }
  if (filters.brandId) {
    filteredProducts = filteredProducts.filter((p) =>
      p.brandId ? p.brandId === filters.brandId : p.brand === filters.brandId
    );
  }
  if (filters.manufacturerId) {
    filteredProducts = filteredProducts.filter(
      (p) => p.manufacturerId === filters.manufacturerId
    );
  }
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      filters.categories!.includes(p.categoryId)
    );
  }
  if (filters.isPrescription !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => !!p.isPrescription === filters.isPrescription
    );
  }

  return filteredProducts;
};
