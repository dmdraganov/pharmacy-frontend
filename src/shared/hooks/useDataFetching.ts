import { useState, useEffect, useCallback } from 'react';

interface UseDataFetchingOptions {
  skip?: boolean;
}

interface UseDataFetchingReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Универсальный хук для асинхронного получения данных.
 * @param fetcher - Асинхронная функция, которая возвращает данные.
 * @param options - Опции, например { skip: true } для пропуска выполнения.
 * @returns {{data: T | null, isLoading: boolean, error: Error | null}}
 */
export const useDataFetching = <T>(
  fetcher: () => Promise<T>,
  options: UseDataFetchingOptions = {}
): UseDataFetchingReturn<T> => {
  const { skip = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (skip) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, skip]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};
