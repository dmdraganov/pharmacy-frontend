import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/shared/api';

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchProducts(searchTerm),
    enabled: Boolean(searchTerm),
  });

  return { searchTerm, searchResults: data || [], isLoading, error };
};
