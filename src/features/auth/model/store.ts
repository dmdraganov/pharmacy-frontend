import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as api from '@/shared/api';
import type { User } from '@/entities/user';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'role'>) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      login: async (email, password) => {
        const userData = await api.login(email, password);
        set({ user: userData, isLoading: false });
      },
      register: async (userData) => {
        await api.register(userData);
      },
      logout: () => {
        set({ user: null });
      },
      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
      checkAuth: async () => {
        const { user } = get();
        if (!user) {
          set({ isLoading: false });
          return;
        }
        try {
          const freshUser = await api.getMe(user.id);
          set({ user: freshUser, isLoading: false });
        } catch (_error) {
          set({ user: null, isLoading: false });
        }
      },
    }),
    {
      name: STORAGE_KEYS.USER_PROFILE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Check auth status when the app loads
useAuthStore.getState().checkAuth();
