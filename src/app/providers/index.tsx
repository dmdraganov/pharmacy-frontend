import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '@/features/cart';
import { FavoritesProvider } from '@/features/favorites';
import { RegionProvider } from '@/features/select-region';
import { UserProvider } from '@/features/manage-user-profile';
import type { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE || undefined}>
      <RegionProvider>
        <FavoritesProvider>
          <CartProvider>
            <UserProvider>{children}</UserProvider>
          </CartProvider>
        </FavoritesProvider>
      </RegionProvider>
    </BrowserRouter>
  );
};
