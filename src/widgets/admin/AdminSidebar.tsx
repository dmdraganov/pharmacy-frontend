import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className='w-64 bg-gray-800 text-white flex flex-col'>
      <div className='p-4 text-2xl font-bold'>Панель администратора</div>
      <nav className='flex-1 px-2 py-4 space-y-2'>
        <NavLink
          to='/admin/dashboard'
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          Дашборд
        </NavLink>
        <NavLink
          to='/admin/products'
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          Товары
        </NavLink>
        <NavLink
          to='/admin/orders'
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          Заказы
        </NavLink>
        <NavLink
          to='/admin/categories'
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`
          }
        >
          Категории
        </NavLink>
      </nav>
      <div className='mt-auto p-2'>
        <NavLink
          to='/'
          className='block px-4 py-2 rounded-md text-center hover:bg-gray-700'
        >
          Вернуться на сайт
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
