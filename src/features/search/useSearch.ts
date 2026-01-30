import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '@/data/products';

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  const searchResults = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.brand.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm]);

  return { searchTerm, searchResults };
};
