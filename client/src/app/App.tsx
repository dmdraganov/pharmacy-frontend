import Spinner from '@/shared/ui/Spinner';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useAuthStore } from '@/features/auth';
import { useOrderStore } from '@/entities/order';

export const App = () => {
  useEffect(() => {
    // We can call an action outside of a component
    useAuthStore.getState().checkAuth();
    useOrderStore.getState()._seedInitialOrders();
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
