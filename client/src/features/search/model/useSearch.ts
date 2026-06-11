import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '@/shared/api';

type SearchFilters = {
  brandId?: string;
  manufacturerId?: string;
  minPrice?: number;
  maxPrice?: number;
  isPrescription?: boolean;
  sort?: string;
};

export const useSearch = (filters: SearchFilters = {}) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm, filters],
    queryFn: () =>
      searchProducts(searchTerm, {
        brand_id: filters.brandId,
        manufacturer_id: filters.manufacturerId,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        is_prescription: filters.isPrescription,
        sort: filters.sort,
      }),
    enabled: Boolean(searchTerm),
  });

  return { searchTerm, searchResults: data || [], isLoading, error };
};
