import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/features/user-profile';
import type { AccountPageView } from '@/pages/AccountPage';

interface AccountSidebarProps {
  activeView: AccountPageView;
  setActiveView: (view: AccountPageView) => void;
}

const NavButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full rounded-md px-4 py-2 text-left font-medium transition-colors ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'bg-transparent text-gray-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className='w-full rounded-md px-4 py-2 text-left font-medium text-gray-700 transition-colors hover:bg-gray-100'
  >
    {children}
  </Link>
);

export const AccountSidebar = memo(
  ({ activeView, setActiveView }: AccountSidebarProps) => {
    const { user } = useUser();

    return (
      <aside className='flex shrink-0 flex-col gap-8 rounded-lg border bg-white p-4 shadow-sm'>
        {/* User Info */}
        <div className='border-b pb-4'>
          <p className='text-lg font-bold'>
            {user.firstName} {user.lastName}
          </p>
          <p className='text-sm text-gray-500'>{user.email}</p>
        </div>

        {/* Navigation */}
        <nav className='flex flex-grow flex-col gap-2'>
          <NavButton
            onClick={() => setActiveView('orders')}
            isActive={activeView === 'orders'}
          >
            Заказы
          </NavButton>
          <NavLink to='/cart'>Корзина</NavLink>
          <NavLink to='/favorites'>Избранное</NavLink>
        </nav>

        {/* Profile Button */}
        <div className='mt-auto'>
          <NavButton
            onClick={() => setActiveView('profile')}
            isActive={activeView === 'profile'}
          >
            Профиль
          </NavButton>
        </div>
      </aside>
    );
  }
);
