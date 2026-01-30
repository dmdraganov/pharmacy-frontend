import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import { useParams } from 'react-router-dom';
import { sections } from '@/data/sections';
import ProductGrid from '@/widgets/ProductGrid';
import FiltersSidebar from '@/widgets/FiltersSidebar/FiltersSidebar';
import { useFilters } from '@/features/filters/useFilters';
import { applyFilters, getAvailableFilters } from '@/features/filters/lib';

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

  const gridColsClass = baseProducts.length > 0 ? 'md:grid-cols-4' : 'md:grid-cols-1';
  const productGridColSpanClass = baseProducts.length > 0 ? 'md:col-span-3' : 'md:col-span-1';

  return (
    <div className={`grid grid-cols-1 gap-8 ${gridColsClass}`}>
      {baseProducts.length > 0 && (
        <div className='col-span-1 min-w-0'>
          <FiltersSidebar
            availableFilters={availableFilters}
            section={currentSection}
            categories={categoryFilterOptions}
          />
        </div>
      )}
      <div className={`col-span-1 ${productGridColSpanClass}`}>
        <ProductGrid title={title} products={displayProducts} />
      </div>
    </div>
  );
});

export default ProductListPage;
