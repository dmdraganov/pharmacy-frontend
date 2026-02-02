import type { ReactNode } from 'react';
import AdminSidebar from '@/widgets/admin/AdminSidebar';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-screen bg-gray-100'>
      <AdminSidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
