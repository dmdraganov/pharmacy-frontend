import { useMemo } from 'react';
import { useSearch } from '@/features/search';
import FiltersSidebar from '@/widgets/FiltersSidebar';
import { useFilters } from '@/features/filters/useFilters';
import { applyFilters, getAvailableFilters } from '@/features/filters/lib';
import CatalogLayoutWidget from '@/widgets/CatalogLayoutWidget';

const SearchPage = () => {
  const { searchTerm, searchResults } = useSearch();
  const { activeFilters } = useFilters();

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
        <FiltersSidebar availableFilters={availableFilters} />
      ) : null,
    [searchResults.length, availableFilters]
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
