import { BrowserRouter } from 'react-router-dom';
import CartProvider from '@/features/cart/providers/CartProvider';
import FavoritesProvider from '@/features/favorites/providers/FavoritesProvider';
import RegionProvider from '@/features/region/providers/RegionProvider';
import { UserProvider } from '@/features/user-profile';
import { composeProviders } from '@/app/providers/composeProviders';
import type { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

const CombinedProviders = composeProviders(
  RegionProvider,
  FavoritesProvider,
  CartProvider,
  UserProvider
);

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter basename='/works/sites/pharmacy/'>
      <CombinedProviders>{children}</CombinedProviders>
    </BrowserRouter>
  );
};
