import { useCallback } from 'react';
import type { ReactNode } from 'react';
import { FavoritesContext } from '@/features/favorites';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/shared/config/constants';

const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(
    STORAGE_KEYS.FAVORITES,
    []
  );

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavoriteIds((prevIds) => {
        if (prevIds.includes(productId)) {
          return prevIds.filter((id) => id !== productId);
        }
        return [...prevIds, productId];
      });
    },
    [setFavoriteIds]
  );

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  );

  const value = {
    favoriteIds,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
