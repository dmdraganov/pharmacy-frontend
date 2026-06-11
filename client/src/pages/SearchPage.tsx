import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@/features/search';
import FiltersSidebar from '@/widgets/layout/FiltersSidebar';
import {
  applyFilters,
  getAvailableFilters,
  useFilters,
} from '@/features/filter-products';
import CatalogLayoutWidget from '@/widgets/layout/CatalogLayoutWidget';
import { getBrands, getManufacturers } from '@/shared/api';

const SearchPage = () => {
  const { activeFilters } = useFilters();
  const { searchTerm, searchResults } = useSearch(activeFilters);
  const { data: catalogDictionaries } = useQuery({
    queryKey: ['catalog-dictionaries'],
    queryFn: async () => {
      const [brands, manufacturers] = await Promise.all([
        getBrands(),
        getManufacturers(),
      ]);

      return { brands, manufacturers };
    },
  });

  const availableFilters = useMemo(
    () => getAvailableFilters(searchResults),
    [searchResults]
  );

  const displayProducts = useMemo(
    () => applyFilters(searchResults, activeFilters),
    [searchResults, activeFilters]
  );

  const title = searchTerm ? `Результаты поиска: "${searchTerm}"` : 'Поиск';

  const sidebar = useMemo(
    () =>
      searchResults.length > 0 ? (
        <FiltersSidebar
          availableFilters={availableFilters}
          brands={catalogDictionaries?.brands}
          manufacturers={catalogDictionaries?.manufacturers}
        />
      ) : null,
    [searchResults.length, availableFilters, catalogDictionaries]
  );

  return (
    <CatalogLayoutWidget
      title={title}
      products={displayProducts}
      sidebar={sidebar}
    />
  );
};

export default SearchPage;
