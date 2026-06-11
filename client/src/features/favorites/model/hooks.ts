import { useFavoritesStore } from './store';

/**
 * Hook for components that only need the list of favorite IDs.
 */
export const useFavoriteIds = () =>
  useFavoritesStore((state) => state.favoriteIds);

export const useFavoriteCount = () =>
  useFavoritesStore((state) => state.favoriteIds.length);

/**
 * Hook for components that only need favorite actions.
 */
export const useFavoriteActions = () =>
  useFavoritesStore((state) => state.toggleFavorite);

/**
 * Hook to check if a specific product is in favorites.
 */
export const useIsFavorite = (productId: string) => {
  return useFavoritesStore((state) => state.favoriteIds.includes(productId));
};
