import { useCallback } from 'react';
import Accordion from '@/shared/ui/Accordion';
import Checkbox from '@/shared/ui/Checkbox';
import RangeInput from '@/shared/ui/RangeInput';
import { useFilters } from '@/features/filters/useFilters';
import type { AvailableFilters } from '@/features/filters/lib';
import type { Section, Category } from '@/entities/section/model';
import { Link } from 'react-router-dom';

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

  return (
    <aside className={className}>
      <h2 className='mb-4 text-xl font-bold'>Фильтры</h2>

      {section && categories && categories.length > 0 && (
        <Accordion title='Категории'>
          <div className='flex flex-col gap-2'>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog/${section.id}/${cat.id}`}
                className='text-sm text-blue-600 hover:underline'
              >
                {cat.name}
              </Link>
            ))}
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
          <div className='flex flex-col gap-2'>
            {availableFilters.brands.map((brand) => (
              <Checkbox
                key={brand}
                id={`brand-${brand}`}
                label={brand}
                checked={activeFilters.brands?.includes(brand) ?? false}
                onChange={() => toggleFilter('brand', brand)}
              />
            ))}
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
