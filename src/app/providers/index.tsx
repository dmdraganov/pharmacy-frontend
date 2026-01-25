import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CartProvider from './CartProvider';
import FavoritesProvider from './FavoritesProvider';
import RegionProvider from './RegionProvider'; // New import

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
