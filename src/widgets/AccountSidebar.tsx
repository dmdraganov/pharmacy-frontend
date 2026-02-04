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
    className={`w-full rounded-md px-4 py-2 text-left font-medium transition-colors cursor-pointer ${
      isActive
        ? 'bg-primary text-text-inverse'
        : 'bg-transparent text-text-default hover:bg-background-hover'
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
    className='w-full rounded-md px-4 py-2 text-left font-medium text-text-default transition-colors hover:bg-background-hover cursor-pointer'
  >
    {children}
  </Link>
);

export const AccountSidebar = memo(
  ({ activeView, setActiveView }: AccountSidebarProps) => {
    const { user } = useUser();

    return (
      <aside className='flex shrink-0 flex-col gap-8 rounded-lg border border-border-default bg-background-default p-4'>
        {/* User Info */}
        <div className='border-b border-border-default pb-4'>
          <p className='text-lg font-bold'>
            {user.firstName} {user.lastName}
          </p>
          <p className='text-sm text-text-muted overflow-hidden text-ellipsis whitespace-nowrap'>
            {user.email}
          </p>
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
