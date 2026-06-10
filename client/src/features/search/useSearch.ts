import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '@/shared/api';
import { useDataFetching } from '@/shared/hooks/useDataFetching';

export const useSearch = () => {
  const { data: products, isLoading, error } = useDataFetching(getProducts);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  const searchResults = useMemo(() => {
    if (!searchTerm || isLoading || error) {
      return [];
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (products || []).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.brand.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, products, isLoading, error]);

  return { searchTerm, searchResults, isLoading, error };
};
