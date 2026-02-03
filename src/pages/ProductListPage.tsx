import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import { useParams } from 'react-router-dom';
import { sections } from '@/data/sections';
import FiltersSidebar from '@/widgets/FiltersSidebar';
import { useFilters } from '@/features/filters/useFilters';
import { applyFilters, getAvailableFilters } from '@/features/filters/lib';
import CatalogLayoutWidget from '@/widgets/CatalogLayoutWidget';

const ProductListPage = memo(() => {
  const { section, category } = useParams<{
    section?: string;
    category?: string;
  }>();

  const { activeFilters } = useFilters();

  const currentSection = useMemo(
    () => (section ? sections.find((sec) => sec.id === section) : undefined),
    [section]
  );

  const currentCategory = useMemo(
    () =>
      category
        ? currentSection?.categories.find((cat) => cat.id === category)
        : undefined,
    [category, currentSection]
  );

  // 1. Determine the most specific product set BEFORE generating filters.
  const baseProducts = useMemo(() => {
    if (category) {
      return products.filter((p) => p.categoryId === category);
    }
    if (section) {
      return products.filter((p) => p.sectionId === section);
    }
    return []; // Should not happen on this page
  }, [section, category]);

  // 2. Generate available filters from the specific product set.
  const availableFilters = useMemo(
    () => getAvailableFilters(baseProducts),
    [baseProducts]
  );

  // 3. Apply active filters to the same specific set for display.
  const displayProducts = useMemo(
    () => applyFilters(baseProducts, activeFilters),
    [baseProducts, activeFilters]
  );

  const title = currentCategory?.name || currentSection?.name || 'Все товары';

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
    [availableFilters, currentSection, categoryFilterOptions]
  );

  return (
    <CatalogLayoutWidget
      title={title}
      products={displayProducts}
      sidebar={sidebar}
    />
  );
});

export default ProductListPage;
