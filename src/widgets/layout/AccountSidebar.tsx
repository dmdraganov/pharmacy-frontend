import { memo } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useUserStore } from '@/features/manage-user-profile';

// Re-usable NavLink component for consistent styling
const NavLink = ({ to, end = false, children }: { to: string, end?: boolean, children: React.ReactNode }) => (
  <RouterNavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `w-full rounded-md px-4 py-2 text-left font-medium transition-colors cursor-pointer ${
        isActive
          ? 'bg-primary text-text-inverse'
          : 'bg-transparent text-text-default hover:bg-background-hover'
      }`
    }
  >
    {children}
  </RouterNavLink>
);


export const AccountSidebar = memo(() => {
  const { user, isLoading } = useUserStore();

  if (isLoading) {
    return (
      <aside className='flex shrink-0 flex-col gap-8 rounded-lg border border-border-default bg-background-default p-4'>
        <div className='border-b border-border-default pb-4'>
          <div className='h-6 w-3/4 rounded bg-gray-300 animate-pulse' />
          <div className='mt-2 h-4 w-1/2 rounded bg-gray-300 animate-pulse' />
        </div>
      </aside>
    );
  }

  return (
    <aside className='flex shrink-0 flex-col gap-8 rounded-lg border border-border-default bg-background-default p-4'>
      {/* User Info */}
      <div className='border-b border-border-default pb-4'>
        <p className='text-lg font-bold'>
          {user?.firstName} {user?.lastName}
        </p>
        <p className='text-sm text-text-muted overflow-hidden text-ellipsis whitespace-nowrap'>
          {user?.email}
        </p>
      </div>

      {/* Navigation */}
      <nav className='flex flex-grow flex-col gap-2'>
        <NavLink to='/account/orders' end>Заказы</NavLink>
        <Link
          to='/cart'
          className='w-full rounded-md px-4 py-2 text-left font-medium text-text-default transition-colors hover:bg-background-hover cursor-pointer'
        >
          Корзина
        </Link>
        <Link
          to='/favorites'
          className='w-full rounded-md px-4 py-2 text-left font-medium text-text-default transition-colors hover:bg-background-hover cursor-pointer'
        >
          Избранное
        </Link>
      </nav>

      {/* Profile Button */}
      <div className='mt-auto'>
        <NavLink to='/account/profile'>Профиль</NavLink>
      </div>
    </aside>
  );
});
