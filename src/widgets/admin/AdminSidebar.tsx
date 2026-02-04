import { NavLink } from 'react-router-dom';
import CloseIcon from '@/shared/ui/CloseIcon';

interface AdminSidebarProps {
  onClose?: () => void;
}

const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  return (
    <div className='w-64 bg-background-default border-r flex flex-col h-full'>
      <div className='p-6 text-xl font-semibold border-b flex justify-between items-center'>
        <span className='lg:hidden'>Панель администратора</span>
        <button onClick={onClose} className='lg:hidden'>
          <CloseIcon className='w-6 h-6' />
        </button>
        <div className='hidden lg:block'>
          <h1 className='text-xl font-semibold'>Админ. панель</h1>
        </div>
      </div>
      <nav className='flex-1 p-4 space-y-2'>
        <NavLink
          to='/admin/dashboard'
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-base font-medium ${
              isActive
                ? 'bg-primary-subtle text-primary-emphasis'
                : 'text-text-muted hover:bg-background-hover hover:text-text-heading'
            }`
          }
        >
          Дашборд
        </NavLink>
        <NavLink
          to='/admin/products'
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-base font-medium ${
              isActive
                ? 'bg-primary-subtle text-primary-emphasis'
                : 'text-text-muted hover:bg-background-hover hover:text-text-heading'
            }`
          }
        >
          Товары
        </NavLink>
        <NavLink
          to='/admin/orders'
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-base font-medium ${
              isActive
                ? 'bg-primary-subtle text-primary-emphasis'
                : 'text-text-muted hover:bg-background-hover hover:text-text-heading'
            }`
          }
        >
          Заказы
        </NavLink>
        <NavLink
          to='/admin/categories'
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-base font-medium ${
              isActive
                ? 'bg-primary-subtle text-primary-emphasis'
                : 'text-text-muted hover:bg-background-hover hover:text-text-heading'
            }`
          }
        >
          Категории
        </NavLink>
      </nav>
      <div className='mt-auto p-4 border-t'>
        <NavLink
          to='/'
          onClick={onClose}
          className='block px-4 py-2 rounded-md text-center text-base font-medium text-text-muted hover:bg-background-hover hover:text-text-heading'
        >
          Вернуться на сайт
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
