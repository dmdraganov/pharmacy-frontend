import { type ReactNode, useState } from 'react';
import AdminSidebar from '@/widgets/admin/AdminSidebar';
import MenuIcon from '@/shared/ui/MenuIcon';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-background-default'>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='lg:hidden bg-background-default border-b p-4 flex items-center'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='text-text-muted'
          >
            <MenuIcon className='h-6 w-6' />
          </button>
          <h1 className='text-xl font-semibold ml-4'>Панель администратора</h1>
        </header>

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
