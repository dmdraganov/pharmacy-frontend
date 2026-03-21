import { Outlet } from 'react-router-dom';
import { AccountSidebar } from '@/widgets/layout/AccountSidebar';

export const AccountLayout = () => {
  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
      <div className='md:col-span-1'>
        <AccountSidebar />
      </div>
      <main className='flex flex-col gap-8 md:col-span-3'>
        <Outlet />
      </main>
    </div>
  );
};
