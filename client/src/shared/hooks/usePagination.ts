import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({
  data,
  itemsPerPage,
}: UsePaginationOptions<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const next = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const prev = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    next,
    prev,
  };
};
