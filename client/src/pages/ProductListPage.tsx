import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  getBrands,
  getManufacturers,
  getProductsPage,
  getSections,
} from '@/shared/api';
import { getAvailableFilters, useFilters } from '@/features/filter-products';
import Spinner from '@/shared/ui/Spinner';
import Pagination from '@/shared/ui/Pagination';
import CatalogLayoutWidget from '@/widgets/layout/CatalogLayoutWidget';
import FiltersSidebar from '@/widgets/layout/FiltersSidebar';

const ProductListPage = memo(() => {
  const { section: sectionId, category: categoryId } = useParams<{
    section?: string;
    category?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const { activeFilters } = useFilters();

  const { data, isLoading, error } = useQuery({
    queryKey: ['catalog', sectionId, categoryId, activeFilters, page],
    queryFn: async () => {
      const [productsPage, sections] = await Promise.all([
        getProductsPage({
          page,
          per_page: 12,
          category_id: categoryId,
          brand_id: activeFilters.brandId,
          manufacturer_id: activeFilters.manufacturerId,
          min_price: activeFilters.minPrice,
          max_price: activeFilters.maxPrice,
          is_prescription: activeFilters.isPrescription,
          sort: activeFilters.sort,
        }),
        getSections(),
      ]);

      return { productsPage, sections };
    },
  });
  const products = useMemo(() => data?.productsPage.data || [], [data]);
  const sections = useMemo(() => data?.sections || [], [data]);
  const meta = data?.productsPage.meta;

  const {
    data: catalogDictionaries,
    isLoading: areCatalogDictionariesLoading,
  } = useQuery({
    queryKey: ['catalog-dictionaries'],
    queryFn: async () => {
      const [brands, manufacturers] = await Promise.all([
        getBrands(),
        getManufacturers(),
      ]);

      return { brands, manufacturers };
    },
  });

  const currentSection = useMemo(
    () =>
      sectionId ? sections.find((sec) => sec.id === sectionId) : undefined,
    [sectionId, sections]
  );

  const currentCategory = useMemo(
    () =>
      categoryId
        ? currentSection?.categories.find((cat) => cat.id === categoryId)
        : undefined,
    [categoryId, currentSection]
  );

  // 1. Determine the most specific product set BEFORE generating filters.
  const baseProducts = useMemo(() => {
    if (isLoading) return []; // Return empty array while loading
    if (categoryId) {
      return products.filter((p) => p.categoryId === categoryId);
    }
    if (sectionId) {
      const sectionCategoryIds =
        currentSection?.categories.map((category) => category.id) || [];
      return products.filter((p) => sectionCategoryIds.includes(p.categoryId));
    }
    return []; // Should not happen on this page
  }, [sectionId, categoryId, products, isLoading, currentSection]);

  // 2. Generate available filters from the specific product set.
  const availableFilters = useMemo(
    () => getAvailableFilters(baseProducts),
    [baseProducts]
  );

  const title = currentCategory?.name || currentSection?.name || 'Загрузка...';

  // Category filter is shown only when a section is selected but not a category.
  const categoryFilterOptions =
    currentSection && !currentCategory ? currentSection.categories : undefined;

  const sidebar = useMemo(
    () => (
      <FiltersSidebar
        availableFilters={availableFilters}
        section={currentSection}
        categories={categoryFilterOptions}
        brands={catalogDictionaries?.brands}
        manufacturers={catalogDictionaries?.manufacturers}
      />
    ),
    [
      availableFilters,
      currentSection,
      categoryFilterOptions,
      catalogDictionaries,
    ]
  );

  if (isLoading || areCatalogDictionariesLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-[60vh] items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке каталога</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <CatalogLayoutWidget
      title={title}
      products={baseProducts}
      sidebar={sidebar}
      footer={
        meta ? (
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            goToPage={(nextPage) => {
              const nextParams = new URLSearchParams(searchParams);
              nextParams.set('page', String(nextPage));
              setSearchParams(nextParams);
            }}
          />
        ) : null
      }
    />
  );
});

export default ProductListPage;
