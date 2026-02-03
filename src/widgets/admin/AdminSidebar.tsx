import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className='w-64 bg-background-default border-r flex flex-col'>
      <div className='p-6 text-xl font-semibold border-b'>
        Панель администратора
      </div>
      <nav className='flex-1 p-4 space-y-2'>
        <NavLink
          to='/admin/dashboard'
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
          className='block px-4 py-2 rounded-md text-center text-base font-medium text-text-muted hover:bg-background-hover hover:text-text-heading'
        >
          Вернуться на сайт
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
