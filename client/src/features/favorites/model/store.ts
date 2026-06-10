import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/shared/config/constants';
import * as favoritesApi from '@/shared/api/favoritesApi';

interface FavoritesState {
  favoriteIds: string[];
  syncFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      syncFavorites: async () => {
        const favoriteIds = await favoritesApi.getFavoriteIds();
        set({ favoriteIds });
      },
      toggleFavorite: async (productId: string) => {
        const isFavorite = useFavoritesStore
          .getState()
          .favoriteIds.includes(productId);

        set((state) => ({
          favoriteIds: isFavorite
            ? state.favoriteIds.filter((id) => id !== productId)
            : [...state.favoriteIds, productId],
        }));

        if (isFavorite) {
          await favoritesApi.removeFavorite(productId);
        } else {
          await favoritesApi.addFavorite(productId);
        }

        await useFavoritesStore.getState().syncFavorites();
      },
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    }
  )
);
