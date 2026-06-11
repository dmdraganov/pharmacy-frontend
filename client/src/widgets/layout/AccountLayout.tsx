import { Outlet } from 'react-router-dom';
import { AccountSidebar } from '@/widgets/layout/AccountSidebar';

export const AccountLayout = () => {
  return (
    <div className='grid min-w-0 grid-cols-1 gap-6 md:grid-cols-4 md:gap-8'>
      <div className='min-w-0 md:col-span-1'>
        <AccountSidebar />
      </div>
      <main className='flex min-w-0 flex-col gap-8 md:col-span-3'>
        <Outlet />
      </main>
    </div>
  );
};
