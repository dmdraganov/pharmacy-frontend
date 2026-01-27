import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CartProvider from '@/features/cart/providers/CartProvider';
import FavoritesProvider from '@/features/favorites/providers/FavoritesProvider';
import RegionProvider from '@/features/region/providers/RegionProvider';

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <RegionProvider>
        <FavoritesProvider>
          <CartProvider>{children}</CartProvider>
        </FavoritesProvider>
      </RegionProvider>
    </BrowserRouter>
  );
};

export default AppProvider;
