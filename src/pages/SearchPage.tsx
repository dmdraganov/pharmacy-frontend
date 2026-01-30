import { useMemo } from 'react';
import { useSearch } from '@/features/search';
import ProductGrid from '@/widgets/ProductGrid';
import FiltersSidebar from '@/widgets/FiltersSidebar/FiltersSidebar';
import { useFilters } from '@/features/filters/useFilters';
import { applyFilters, getAvailableFilters } from '@/features/filters/lib';

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

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
      <div className='col-span-1 min-w-0'>
        <FiltersSidebar availableFilters={availableFilters} />
      </div>
      <div className='col-span-1 md:col-span-3'>
        <ProductGrid title={title} products={displayProducts} />
      </div>
    </div>
  );
};

export default SearchPage;
