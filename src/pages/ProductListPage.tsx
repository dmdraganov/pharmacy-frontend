import { memo, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getSections } from '@/shared/api';
import { applyFilters, getAvailableFilters } from '@/features/filter-products/lib';
import { useFilters } from '@/features/filter-products/useFilters';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Spinner from '@/shared/ui/Spinner';
import CatalogLayoutWidget from '@/widgets/layout/CatalogLayoutWidget';
import FiltersSidebar from '@/widgets/layout/FiltersSidebar';

const ProductListPage = memo(() => {
  const { section: sectionId, category: categoryId } = useParams<{
    section?: string;
    category?: string;
  }>();

  const fetchData = useCallback(
    () => Promise.all([getProducts(), getSections()]),
    [],
  );

  const { data, isLoading, error } = useDataFetching(fetchData);
  const [products, sections] = data || [[], []];

  const { activeFilters } = useFilters();

  const currentSection = useMemo(
    () => (sectionId ? sections.find((sec) => sec.id === sectionId) : undefined),
    [sectionId, sections],
  );

  const currentCategory = useMemo(
    () =>
      categoryId
        ? currentSection?.categories.find((cat) => cat.id === categoryId)
        : undefined,
    [categoryId, currentSection],
  );

  // 1. Determine the most specific product set BEFORE generating filters.
  const baseProducts = useMemo(() => {
    if (isLoading) return []; // Return empty array while loading
    if (categoryId) {
      return products.filter((p) => p.categoryId === categoryId);
    }
    if (sectionId) {
      return products.filter((p) => p.sectionId === sectionId);
    }
    return []; // Should not happen on this page
  }, [sectionId, categoryId, products, isLoading]);

  // 2. Generate available filters from the specific product set.
  const availableFilters = useMemo(
    () => getAvailableFilters(baseProducts),
    [baseProducts],
  );

  // 3. Apply active filters to the same specific set for display.
  const displayProducts = useMemo(
    () => applyFilters(baseProducts, activeFilters),
    [baseProducts, activeFilters],
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
      />
    ),
    [availableFilters, currentSection, categoryFilterOptions],
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-center text-danger">
        <h2 className="text-2xl font-bold">Ошибка при загрузке каталога</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <CatalogLayoutWidget
      title={title}
      products={displayProducts}
      sidebar={sidebar}
    />
  );
});

export default ProductListPage;
