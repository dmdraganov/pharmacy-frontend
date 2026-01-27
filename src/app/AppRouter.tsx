import { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom'; // Added Outlet
import Spinner from '@/shared/ui/Spinner';
import PageLayout from '@/app/layouts/PageLayout'; // Imported PageLayout

// Eagerly loaded pages
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';

// Lazily loaded pages
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const DeliveryPage = lazy(() => import('@/pages/DeliveryPage'));
const ProductListPage = lazy(() => import('@/pages/ProductListPage'));

const AppRouter = () => {
  return (
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
          <Route path='catalog/:category' element={<ProductListPage />} />
          <Route
            path='catalog/:category/:subcategory'
            element={<ProductListPage />}
          />
          <Route path='cart' element={<CartPage />} />
          <Route path='favorites' element={<FavoritesPage />} />
          <Route path='delivery' element={<DeliveryPage />} />
          <Route path='product/:id' element={<ProductPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
