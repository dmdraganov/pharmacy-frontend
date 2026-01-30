import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export type FilterParams = {
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  categories?: string[];
  isPrescription?: boolean;
};

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters = useMemo((): FilterParams => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brands = searchParams.getAll('brand');
    const categories = searchParams.getAll('category');
    const isPrescription = searchParams.get('isPrescription');

    return {
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brands: brands.length > 0 ? brands : undefined,
      categories: categories.length > 0 ? categories : undefined,
      isPrescription: isPrescription ? isPrescription === 'true' : undefined,
    };
  }, [searchParams]);

  const setFilter = (key: string, value: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key); // Clear existing values

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
    setSearchParams(newParams);
  };

  return { activeFilters, setFilter, toggleFilter, removeFilter };
};
