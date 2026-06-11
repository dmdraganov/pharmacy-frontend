import { type ReactNode, useState } from 'react';
import AdminSidebar from '@/widgets/layout/AdminSidebar';
import MenuIcon from '@/shared/ui/MenuIcon';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-dvh min-w-0 bg-background-default'>
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

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <header className='lg:hidden bg-background-default border-b p-4 flex items-center min-w-0'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='text-text-muted'
          >
            <MenuIcon className='h-6 w-6' />
          </button>
          <h1 className='ml-4 min-w-0 truncate text-xl font-semibold'>
            Панель администратора
          </h1>
        </header>

        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background-muted'>
          <div className='container mx-auto min-w-0 max-w-[1280px] px-3 py-8 md:px-4 lg:px-6 lg:py-12'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
