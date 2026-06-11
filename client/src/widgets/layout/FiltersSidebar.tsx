import { useCallback, useState } from 'react';
import Accordion from '@/shared/ui/Accordion';
import Checkbox from '@/shared/ui/Checkbox';
import RangeInput from '@/shared/ui/RangeInput';
import { useFilters, type AvailableFilters } from '@/features/filter-products';
import type { Section, Category } from '@/entities/section';
import { Link } from 'react-router-dom';
import Button from '@/shared/ui/Button';

const ITEM_THRESHOLD = 6;

type FilterOption = {
  id: string;
  name: string;
};

type FiltersSidebarProps = {
  availableFilters: AvailableFilters;
  section?: Section;
  categories?: Category[];
  brands?: FilterOption[];
  manufacturers?: FilterOption[];
  className?: string;
};

const SORT_OPTIONS = [
  { value: '', label: 'По названию' },
  { value: 'price_asc', label: 'Сначала дешевле' },
  { value: 'price_desc', label: 'Сначала дороже' },
  { value: 'newest', label: 'Сначала новые' },
];

const FiltersSidebar = ({
  availableFilters,
  section,
  categories,
  brands = [],
  manufacturers = [],
  className,
}: FiltersSidebarProps) => {
  const { activeFilters, setFilter, removeFilter } = useFilters();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllManufacturers, setShowAllManufacturers] = useState(false);

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

  const displayBrands =
    brands.length > ITEM_THRESHOLD && !showAllBrands
      ? brands.slice(0, ITEM_THRESHOLD)
      : brands;
  const hasMoreBrands = brands.length > ITEM_THRESHOLD;

  const displayManufacturers =
    manufacturers.length > ITEM_THRESHOLD && !showAllManufacturers
      ? manufacturers.slice(0, ITEM_THRESHOLD)
      : manufacturers;
  const hasMoreManufacturers = manufacturers.length > ITEM_THRESHOLD;

  const toggleSingleFilter = (key: string, value: string) => {
    if (
      (key === 'brandId' && activeFilters.brandId === value) ||
      (key === 'manufacturerId' && activeFilters.manufacturerId === value)
    ) {
      removeFilter(key);
      return;
    }

    setFilter(key, value);
  };

  return (
    <aside className={className}>
      <h2 className='mb-4 text-xl font-bold text-text-default'>Фильтры</h2>

      <Accordion title='Сортировка'>
        <select
          value={activeFilters.sort || ''}
          onChange={(event) => {
            const { value } = event.target;
            if (value) {
              setFilter('sort', value);
            } else {
              removeFilter('sort');
            }
          }}
          className='w-full rounded-md border border-border-default bg-bg-default px-3 py-2 text-sm text-text-default focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value || 'name'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Accordion>

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

      {brands.length > 0 && (
        <Accordion title='Бренд'>
          <div className='flex flex-col gap-2 items-start'>
            {displayBrands.map((brand) => (
              <Checkbox
                key={brand.id}
                id={`brand-${brand.id}`}
                label={brand.name}
                checked={activeFilters.brandId === brand.id}
                onChange={() => toggleSingleFilter('brandId', brand.id)}
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

      {manufacturers.length > 0 && (
        <Accordion title='Производитель'>
          <div className='flex flex-col gap-2 items-start'>
            {displayManufacturers.map((manufacturer) => (
              <Checkbox
                key={manufacturer.id}
                id={`manufacturer-${manufacturer.id}`}
                label={manufacturer.name}
                checked={activeFilters.manufacturerId === manufacturer.id}
                onChange={() =>
                  toggleSingleFilter('manufacturerId', manufacturer.id)
                }
              />
            ))}
            {hasMoreManufacturers && (
              <Button
                variant='link'
                size='none'
                onClick={() => setShowAllManufacturers((prev) => !prev)}
                className='mt-2'
              >
                {showAllManufacturers ? 'Скрыть' : 'Показать ещё'}
              </Button>
            )}
          </div>
        </Accordion>
      )}

      {availableFilters.isPrescription && (
        <Accordion title='Условия отпуска'>
          <Checkbox
            id='prescription'
            label='С проверкой в аптеке'
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
