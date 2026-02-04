import type { ReactNode } from 'react';
import AdminSidebar from '@/widgets/admin/AdminSidebar';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-screen bg-background-default'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background-muted'>
          <div className='container mx-auto max-w-[1280px] px-3 md:px-4 lg:px-6 py-12'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
