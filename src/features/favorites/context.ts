import { createContext } from 'react';

interface FavoritesContextValue {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const FavoritesContext = createContext<
  FavoritesContextValue | undefined
>(undefined);


