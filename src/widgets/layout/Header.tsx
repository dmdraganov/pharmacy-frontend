import { memo, useState, useEffect } from 'react';
import Logo from '@/shared/ui/Logo';
import Button from '@/shared/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { RegionSelectWithSearch } from '@/features/select-region';
import { useCartTotals } from '@/features/cart';
import { useFavoriteIds } from '@/features/favorites';
import { useAuthStore } from '@/features/auth';
import { useDropdown } from '@/shared/hooks/useDropdown';
import UserIcon from '@/shared/ui/UserIcon';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems: cartTotalItems } = useCartTotals();
  const favoriteIds = useFavoriteIds();
  const { user, logout } = useAuthStore();
  const { isOpen, close, containerProps, dropdownRef } = useDropdown({
    triggerOn: 'hover',
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCatalogToggle = () => {
    if (location.pathname === '/catalog') {
      navigate(-1);
    } else {
      navigate('/catalog');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoutAndClose = () => {
    handleLogout();
    close(true);
  };

  return (
    <header className='sticky top-0 z-50 border-b border-border-default bg-background-default'>
      <div className='container max-w-7xl mx-auto px-3 md:px-4 lg:px-6'>
        <div
          className={`flex justify-start transition-all duration-300 ease-in-out ${
            isScrolled ? 'max-h-0 pt-0 opacity-0' : 'max-h-16 pt-4 opacity-100'
          }`}
        >
          <RegionSelectWithSearch />
        </div>
        <div className='flex items-center justify-between py-4'>
          <Logo />

          <div className='flex flex-1 items-center justify-center gap-4 px-8'>
            <Button onClick={handleCatalogToggle}>Каталог</Button>
            <SearchInput />
          </div>

          <nav className='flex items-center space-x-4'>
            <Link
              to='/favorites'
              className='relative text-text-muted hover:text-text-default'
            >
              Избранное
              {favoriteIds.length > 0 && (
                <span className='absolute -top-1 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-xs text-white'>
                  {favoriteIds.length}
                </span>
              )}
            </Link>
            <Link
              to='/cart'
              className='relative text-text-muted hover:text-text-default'
            >
              Корзина
              {cartTotalItems > 0 && (
                <span className='absolute -top-1 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-xs text-white'>
                  {cartTotalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div
                ref={dropdownRef}
                className='relative inline-block'
                {...containerProps}
              >
                <Link to='/account' className='text-text-muted'>
                  <UserIcon />
                </Link>

                {isOpen && (
                  <div className='absolute right-0 mt-2 w-56 rounded-md border border-border-default bg-background-default shadow-lg z-50'>
                    <div className='p-2'>
                      <div className='px-3 py-2 border-b border-border-default mb-2'>
                        <p className='text-base font-bold text-text-default truncate'>
                          {user.firstName} {user.lastName}
                        </p>
                        <p className='text-sm text-text-muted truncate'>
                          {user.email}
                        </p>
                      </div>
                      <div onClick={() => close(true)}>
                        <Link
                          to='/account/profile'
                          className='text-text-default block px-3 py-2 text-base hover:bg-background-muted-hover cursor-pointer'
                        >
                          Профиль
                        </Link>
                        <Link
                          to='/account/orders'
                          className='text-text-default block px-3 py-2 text-base hover:bg-background-muted-hover cursor-pointer'
                        >
                          Заказы
                        </Link>
                        <button
                          onClick={handleLogoutAndClose}
                          className='text-danger block w-full text-left px-3 py-2 text-base hover:bg-danger-subtle hover:text-danger-hover cursor-pointer'
                        >
                          Выйти
                        </button>
                        {user.role === 'ADMIN' && (
                          <Link
                            to='/admin'
                            className='text-text-default block px-3 py-2 text-base hover:bg-background-muted-hover cursor-pointer'
                          >
                            Панель администратора
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/login'
                className='text-text-muted hover:text-text-default'
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
