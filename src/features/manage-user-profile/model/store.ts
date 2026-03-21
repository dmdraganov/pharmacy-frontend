import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/entities/user';
import { getUser } from '@/shared/api';
import { STORAGE_KEYS } from '@/shared/config/constants';

export interface UserState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (newUserData: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
}

const initialState = {
  user: null,
  isLoading: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setLoading: (isLoading) => set({ isLoading }),
      fetchUser: async () => {
        // Prevent refetching if data is already being loaded or present
        if (get().user && !get().isLoading) return;

        set({ isLoading: true });
        try {
          const user = await getUser();
          set({ user, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          set({
            user: {
              firstName: 'Guest',
              lastName: '',
              phone: '',
              email: '',
            },
            isLoading: false,
          });
        }
      },
      updateUser: (newUserData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...newUserData } : null,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.USER_PROFILE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        // Fetch initial data only if it's not in storage
        if (!state?.user) {
          state?.fetchUser();
        } else {
          // If user is loaded from storage, we are no longer loading.
          state?.setLoading(false);
        }
      },
    }
  )
);
