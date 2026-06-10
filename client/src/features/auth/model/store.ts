import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as api from '@/shared/api';
import { getAuthToken } from '@/shared/api/apiClient';
import type { User } from '@/entities/user';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
  isUpdateLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'role'>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthLoading: true,
      isLoginLoading: false,
      isRegisterLoading: false,
      isUpdateLoading: false,
      login: async (email, password) => {
        set({ isLoginLoading: true });
        try {
          const userData = await api.login(email, password);
          set({ user: userData });
        } finally {
          set({ isLoginLoading: false });
        }
      },
      register: async (userData) => {
        set({ isRegisterLoading: true });
        try {
          await api.register(userData);
        } finally {
          set({ isRegisterLoading: false });
        }
      },
      logout: async () => {
        await api.logout();
        set({ user: null });
      },
      updateProfile: async (data) => {
        set({ isUpdateLoading: true });
        try {
          const user = await api.updateProfile(data);
          set({ user });
        } finally {
          set({ isUpdateLoading: false });
        }
      },
      checkAuth: async () => {
        set({ isAuthLoading: true });
        try {
          if (!getAuthToken()) {
            set({ user: null });
            return;
          }
          const freshUser = await api.getMe();
          set({ user: freshUser });
        } catch (_error) {
          set({ user: null });
        } finally {
          set({ isAuthLoading: false });
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
