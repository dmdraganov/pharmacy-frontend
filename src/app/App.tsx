import Spinner from '@/shared/ui/Spinner';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useAuthStore } from '@/features/auth';

export const App = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
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
