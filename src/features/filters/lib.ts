import type { Product } from '@/entities/product/model';

export type AvailableFilters = {
  minPrice: number;
  maxPrice: number;
  brands: string[];
  isPrescription: boolean;
};

export const getAvailableFilters = (products: Product[]): AvailableFilters => {
  if (products.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      brands: [],
      isPrescription: false,
    };
  }

  const prices = products.map((p) => p.price);
  const brands = new Set(products.map((p) => p.brand));
  const isPrescription = products.some((p) => p.isPrescription);

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    brands: Array.from(brands).sort(),
    isPrescription,
  };
};

export const applyFilters = (
  products: Product[],
  filters: import('./useFilters').FilterParams
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
  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      filters.brands!.includes(p.brand)
    );
  }
  if (filters.subcategories && filters.subcategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      filters.subcategories!.includes(p.subcategoryId)
    );
  }
  if (filters.isPrescription !== undefined) {
    filteredProducts = filteredProducts.filter(
      (p) => p.isPrescription === filters.isPrescription
    );
  }

  return filteredProducts;
};
