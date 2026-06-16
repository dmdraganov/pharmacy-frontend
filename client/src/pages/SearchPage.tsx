import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@/features/search';
import FiltersSidebar from '@/widgets/layout/FiltersSidebar';
import {
  getAvailableFilters,
  useFilters,
} from '@/features/filter-products';
import CatalogLayoutWidget from '@/widgets/layout/CatalogLayoutWidget';
import { getBrands, getManufacturers } from '@/shared/api';

const SearchPage = () => {
  const { activeFilters } = useFilters();
  const { searchTerm, searchResults } = useSearch(activeFilters);
  const { searchResults: filterSourceProducts } = useSearch();
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
    () => getAvailableFilters(filterSourceProducts),
    [filterSourceProducts]
  );

  const availableBrands = useMemo(() => {
    const brandIds = new Set(
      filterSourceProducts
        .map((product) => product.brandId)
        .filter((brandId): brandId is string => Boolean(brandId))
    );

    return (catalogDictionaries?.brands || []).filter((brand) =>
      brandIds.has(brand.id)
    );
  }, [filterSourceProducts, catalogDictionaries?.brands]);

  const availableManufacturers = useMemo(() => {
    const manufacturerIds = new Set(
      filterSourceProducts
        .map((product) => product.manufacturerId)
        .filter((manufacturerId): manufacturerId is string =>
          Boolean(manufacturerId)
        )
    );

    return (catalogDictionaries?.manufacturers || []).filter((manufacturer) =>
      manufacturerIds.has(manufacturer.id)
    );
  }, [filterSourceProducts, catalogDictionaries?.manufacturers]);

  const title = searchTerm ? `Результаты поиска: "${searchTerm}"` : 'Поиск';

  const sidebar = useMemo(
    () =>
      filterSourceProducts.length > 0 ? (
        <FiltersSidebar
          availableFilters={availableFilters}
          brands={availableBrands}
          manufacturers={availableManufacturers}
        />
      ) : null,
    [
      filterSourceProducts.length,
      availableFilters,
      availableBrands,
      availableManufacturers,
    ]
  );

  return (
    <CatalogLayoutWidget
      title={title}
      products={searchResults}
      sidebar={sidebar}
    />
  );
};

export default SearchPage;
