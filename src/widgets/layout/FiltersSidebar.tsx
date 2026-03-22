import { useCallback, useState } from 'react';
import Accordion from '@/shared/ui/Accordion';
import Checkbox from '@/shared/ui/Checkbox';
import RangeInput from '@/shared/ui/RangeInput';
import { useFilters } from '@/features/filter-products/useFilters';
import type { AvailableFilters } from '@/features/filter-products/lib';
import type { Section, Category } from '@/entities/section/types';
import { Link } from 'react-router-dom';
import Button from '@/shared/ui/Button'; // Import Button component

const ITEM_THRESHOLD = 6; // Define the threshold for "show more"

type FiltersSidebarProps = {
  availableFilters: AvailableFilters;
  section?: Section;
  categories?: Category[];
  className?: string;
};

const FiltersSidebar = ({
  availableFilters,
  section,
  categories,
  className,
}: FiltersSidebarProps) => {
  const { activeFilters, setFilter, toggleFilter, removeFilter } = useFilters();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const handleMinPriceChange = useCallback(
    (value: number) => {
      setFilter('minPrice', String(value));
    },
    [setFilter]
  );

  const handleMaxPriceChange = useCallback(
    (value: number) => {
      setFilter('maxPrice', String(value));
    },
    [setFilter]
  );

  // Ensure maxPrice is not less than minPrice
  const minPriceValue = activeFilters.minPrice ?? availableFilters.minPrice;
  const maxPriceValue = Math.max(
    activeFilters.maxPrice ?? availableFilters.maxPrice,
    minPriceValue
  );

  // --- Categories Logic ---
  const displayCategories =
    categories && categories.length > ITEM_THRESHOLD && !showAllCategories
      ? categories.slice(0, ITEM_THRESHOLD)
      : categories;
  const hasMoreCategories = categories && categories.length > ITEM_THRESHOLD;

  // --- Brands Logic ---
  const displayBrands =
    availableFilters.brands.length > ITEM_THRESHOLD && !showAllBrands
      ? availableFilters.brands.slice(0, ITEM_THRESHOLD)
      : availableFilters.brands;
  const hasMoreBrands = availableFilters.brands.length > ITEM_THRESHOLD;

  return (
    <aside className={className}>
      <h2 className='mb-4 text-xl font-bold text-text-default'>Фильтры</h2>

      {section && categories && categories.length > 0 && (
        <Accordion title='Категории'>
          <div className='flex flex-col gap-2 items-start'>
            {(displayCategories || []).map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog/${section.id}/${cat.id}`}
                className='text-sm text-primary hover:underline'
              >
                {cat.name}
              </Link>
            ))}
            {hasMoreCategories && (
              <Button
                variant='link'
                size='none'
                onClick={() => setShowAllCategories((prev) => !prev)}
                className='mt-2'
              >
                {showAllCategories ? 'Скрыть' : 'Показать ещё'}
              </Button>
            )}
          </div>
        </Accordion>
      )}

      <Accordion title='Цена, ₽'>
        <RangeInput
          min={availableFilters.minPrice}
          max={availableFilters.maxPrice}
          minValue={minPriceValue}
          maxValue={maxPriceValue}
          onMinChange={handleMinPriceChange}
          onMaxChange={handleMaxPriceChange}
        />
      </Accordion>

      {availableFilters.brands.length > 0 && (
        <Accordion title='Бренд'>
          <div className='flex flex-col gap-2 items-start'>
            {displayBrands.map((brand) => (
              <Checkbox
                key={brand}
                id={`brand-${brand}`}
                label={brand}
                checked={activeFilters.brands?.includes(brand) ?? false}
                onChange={() => toggleFilter('brand', brand)}
              />
            ))}
            {hasMoreBrands && (
              <Button
                variant='link'
                size='none'
                onClick={() => setShowAllBrands((prev) => !prev)}
                className='mt-2'
              >
                {showAllBrands ? 'Скрыть' : 'Показать ещё'}
              </Button>
            )}
          </div>
        </Accordion>
      )}

      {availableFilters.isPrescription && (
        <Accordion title='Рецепт'>
          <Checkbox
            id='prescription'
            label='По рецепту'
            checked={activeFilters.isPrescription ?? false}
            onChange={(e) => {
              const { checked } = e.target;
              if (checked) {
                setFilter('isPrescription', 'true');
              } else {
                removeFilter('isPrescription');
              }
            }}
          />
        </Accordion>
      )}
    </aside>
  );
};

export default FiltersSidebar;
