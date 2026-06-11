import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export type FilterParams = {
  minPrice?: number;
  maxPrice?: number;
  brandId?: string;
  manufacturerId?: string;
  categories?: string[];
  isPrescription?: boolean;
  sort?: string;
};

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters = useMemo((): FilterParams => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brandId = searchParams.get('brandId');
    const manufacturerId = searchParams.get('manufacturerId');
    const categories = searchParams.getAll('category');
    const isPrescription = searchParams.get('isPrescription');
    const sort = searchParams.get('sort');

    return {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brandId: brandId || undefined,
      manufacturerId: manufacturerId || undefined,
      categories: categories.length > 0 ? categories : undefined,
      isPrescription: isPrescription ? isPrescription === 'true' : undefined,
      sort: sort || undefined,
    };
  }, [searchParams]);

  const setFilter = (key: string, value: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key); // Clear existing values
    newParams.delete('page');

    if (Array.isArray(value)) {
      value.forEach((v) => newParams.append(key, v));
    } else if (value) {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  };

  const toggleFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const allValues = newParams.getAll(key);
    newParams.delete('page');

    if (allValues.includes(value)) {
      // Value exists, so remove it
      const filteredValues = allValues.filter((v) => v !== value);
      newParams.delete(key);
      filteredValues.forEach((v) => newParams.append(key, v));
    } else {
      // Value does not exist, so add it
      newParams.append(key, value);
    }

    setSearchParams(newParams);
  };

  const removeFilter = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  return { activeFilters, setFilter, toggleFilter, removeFilter };
};
