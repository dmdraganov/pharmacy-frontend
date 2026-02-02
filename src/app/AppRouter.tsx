import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Spinner from '@/shared/ui/Spinner';
import PageLayout from '@/app/layouts/PageLayout';
import AdminLayout from '@/app/layouts/AdminLayout';
import ScrollToTop from '@/shared/lib/router/ScrollToTop';

// Eagerly loaded pages
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';

// Lazily loaded pages
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const DeliveryPage = lazy(() => import('@/pages/DeliveryPage'));
const ProductListPage = lazy(() => import('@/pages/ProductListPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const CatalogPage = lazy(() => import('@/pages/CatalogPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));

// Admin Pages
const AdminDashboardPage = lazy(
  () => import('@/pages/admin/AdminDashboardPage')
);
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminCategoriesPage = lazy(
  () => import('@/pages/admin/AdminCategoriesPage')
);

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className='flex h-screen items-center justify-center'>
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route
            path='/'
            element={
              <PageLayout>
                <Outlet />
              </PageLayout>
            }
          >
            <Route index element={<HomePage />} />
            <Route path='catalog' element={<CatalogPage />} />
            <Route path='catalog/:section' element={<ProductListPage />} />
            <Route
              path='catalog/:section/:category'
              element={<ProductListPage />}
            />
            <Route path='cart' element={<CartPage />} />
            <Route path='favorites' element={<FavoritesPage />} />
            <Route path='delivery' element={<DeliveryPage />} />
            <Route path='about' element={<AboutPage />} />
            <Route path='contacts' element={<ContactsPage />} />
            <Route path='product/:id' element={<ProductPage />} />
            <Route path='search' element={<SearchPage />} />
            <Route path='account' element={<AccountPage />} />
            <Route path='checkout' element={<CheckoutPage />} />
            <Route path='privacy-policy' element={<PrivacyPolicyPage />} />
          </Route>
          <Route
            path='/admin'
            element={
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            }
          >
            <Route index element={<Navigate to='dashboard' replace />} />
            <Route path='dashboard' element={<AdminDashboardPage />} />
            <Route path='products' element={<AdminProductsPage />} />
            <Route path='orders' element={<AdminOrdersPage />} />
            <Route path='categories' element={<AdminCategoriesPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
