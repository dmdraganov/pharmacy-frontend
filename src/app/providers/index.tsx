import { BrowserRouter } from 'react-router-dom';
import CartProvider from '@/features/cart/providers/CartProvider';
import FavoritesProvider from '@/features/favorites/providers/FavoritesProvider';
import RegionProvider from '@/features/region/providers/RegionProvider';
import { UserProvider } from '@/features/user-profile';
import type { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter basename='/works/sites/pharmacy/'>
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
