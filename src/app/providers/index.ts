import { BrowserRouter } from 'react-router-dom';
import CartProvider from '@/features/cart/providers/CartProvider';
import FavoritesProvider from '@/features/favorites/providers/FavoritesProvider';
import RegionProvider from '@/features/region/providers/RegionProvider';
import { UserProvider } from '@/features/user-profile';
import { composeProviders } from '@/app/providers/composeProviders';

export const AppProvider = composeProviders(
  BrowserRouter,
  RegionProvider,
  FavoritesProvider,
  CartProvider,
  UserProvider
);
