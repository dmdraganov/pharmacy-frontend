import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import { useParams } from 'react-router-dom';
import { categories } from '@/data/categories';
import ProductGrid from '@/widgets/ProductGrid';
import FiltersSidebar from '@/widgets/FiltersSidebar/FiltersSidebar';
import { useFilters } from '@/features/filters/useFilters';
import { applyFilters, getAvailableFilters } from '@/features/filters/lib';

const ProductListPage = memo(() => {
  const { category, subcategory } = useParams<{
    category?: string;
    subcategory?: string;
  }>();

  const { activeFilters } = useFilters();

  const currentCategory = useMemo(
    () =>
      category ? categories.find((cat) => cat.id === category) : undefined,
    [category]
  );

  const currentSubcategory = useMemo(
    () =>
      subcategory
        ? currentCategory?.subcategories.find((sub) => sub.id === subcategory)
        : undefined,
    [subcategory, currentCategory]
  );

  // 1. Determine the most specific product set BEFORE generating filters.
  const baseProducts = useMemo(() => {
    if (subcategory) {
      return products.filter((p) => p.subcategoryId === subcategory);
    }
    if (category) {
      return products.filter((p) => p.categoryId === category);
    }
    return []; // Should not happen on this page
  }, [category, subcategory]);

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

  const title =
    currentSubcategory?.name || currentCategory?.name || 'Все товары';

  // Subcategory filter is shown only when a category is selected but not a subcategory.
  const subcategoryFilterOptions =
    currentCategory && !currentSubcategory
      ? currentCategory.subcategories
      : undefined;

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
      <div className='col-span-1 min-w-0'>
        <FiltersSidebar
          availableFilters={availableFilters}
          category={currentCategory}
          subcategories={subcategoryFilterOptions}
        />
      </div>
      <div className='col-span-1 md:col-span-3'>
        <ProductGrid title={title} products={displayProducts} />
      </div>
    </div>
  );
});

export default ProductListPage;
