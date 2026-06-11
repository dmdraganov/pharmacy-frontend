import { create } from 'zustand';
import * as favoritesApi from '@/shared/api/favoritesApi';

interface FavoritesState {
  favoriteIds: string[];
  syncFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()((set) => ({
  favoriteIds: [],
  syncFavorites: async () => {
    const favoriteIds = await favoritesApi.getFavoriteIds();
    set({ favoriteIds });
  },
  toggleFavorite: async (productId: string) => {
    const currentFavoriteIds = useFavoritesStore.getState().favoriteIds;
    const isFavorite = currentFavoriteIds.includes(productId);

    set((state) => ({
      favoriteIds: isFavorite
        ? state.favoriteIds.filter((id) => id !== productId)
        : [...state.favoriteIds, productId],
    }));

    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(productId);
      } else {
        await favoritesApi.addFavorite(productId);
      }
    } catch (error) {
      set({ favoriteIds: currentFavoriteIds });
      throw error;
    }
  },
}));
