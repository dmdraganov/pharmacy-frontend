import { useState, useMemo } from 'react';
import { products } from '@/data/products';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        product.brand.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm]);

  return { searchTerm, setSearchTerm, searchResults };
};
