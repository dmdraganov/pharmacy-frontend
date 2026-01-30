import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Spinner from '@/shared/ui/Spinner';
import PageLayout from '@/app/layouts/PageLayout';
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
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
