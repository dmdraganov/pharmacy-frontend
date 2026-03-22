import Spinner from '@/shared/ui/Spinner';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

export const App = () => {
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
