import { lazy } from 'react';

export { default as HomePage } from './HomePage';
export { default as ProductPage } from './ProductPage';
export { default as CartPage } from './CartPage';

export const FavoritesPage = lazy(() => import('./FavoritesPage'));
export const DeliveryPage = lazy(() => import('./DeliveryPage'));
export const ProductListPage = lazy(() => import('./ProductListPage'));
export const SearchPage = lazy(() => import('./SearchPage'));
export const CatalogPage = lazy(() => import('./CatalogPage'));
export const AboutPage = lazy(() => import('./AboutPage'));
export const ContactsPage = lazy(() => import('./ContactsPage'));
export const CheckoutPage = lazy(() => import('./CheckoutPage'));
export const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicyPage'));
export const AccountOrdersPage = lazy(
  () => import('./account/AccountOrdersPage')
);
export const AccountProfilePage = lazy(
  () => import('./account/AccountProfilePage')
);

export const AdminDashboardPage = lazy(
  () => import('./admin/AdminDashboardPage')
);
export const AdminProductsPage = lazy(
  () => import('./admin/AdminProductsPage')
);
export const AdminOrdersPage = lazy(() => import('./admin/AdminOrdersPage'));
export const AdminCategoriesPage = lazy(
  () => import('./admin/AdminCategoriesPage')
);
