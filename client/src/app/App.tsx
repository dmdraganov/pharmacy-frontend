import Spinner from '@/shared/ui/Spinner';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { useAuthStore } from '@/features/auth';
import { useCartStore } from '@/features/cart';
import { useFavoritesStore } from '@/features/favorites/model/store';

export const App = () => {
  useEffect(() => {
    // We can call an action outside of a component
    useAuthStore
      .getState()
      .checkAuth()
      .finally(() => {
        useCartStore.getState().syncCart();
        useFavoritesStore.getState().syncFavorites();
      });
  }, []);

  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <Spinner />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};
