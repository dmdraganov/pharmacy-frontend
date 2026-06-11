import { ROUTES } from '@/shared/config/router';
import { memo, useState, useEffect } from 'react';
import Logo from '@/shared/ui/Logo';
import Button from '@/shared/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { RegionSelectWithSearch } from '@/features/select-region';
import { useCartTotalItems } from '@/features/cart';
import { useFavoriteCount } from '@/features/favorites';
import { useAuthStore } from '@/features/auth';
import { useDropdown } from '@/shared/hooks/useDropdown';
import UserIcon from '@/shared/ui/UserIcon';
import MenuIcon from '@/shared/ui/MenuIcon';
import CloseIcon from '@/shared/ui/CloseIcon';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartTotalItems = useCartTotalItems();
  const favoriteCount = useFavoriteCount();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
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
    if (location.pathname === ROUTES.catalog) {
      navigate(-1);
    } else {
      navigate(ROUTES.catalog);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
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
            isScrolled
              ? 'max-h-0 overflow-hidden pt-0 opacity-0'
              : 'max-h-20 overflow-visible pt-3 opacity-100 sm:max-h-16 sm:pt-4'
          }`}
        >
          <RegionSelectWithSearch />
        </div>
        <div className='flex flex-wrap items-center justify-between gap-3 py-3 lg:flex-nowrap lg:py-4'>
          <Logo />

          <div className='hidden flex-1 items-center justify-center gap-4 px-8 lg:flex'>
            <Button onClick={handleCatalogToggle}>Каталог</Button>
            <SearchInput />
          </div>

          <nav className='hidden items-center space-x-4 lg:flex'>
            <Link
              to={ROUTES.favorites}
              className='relative text-text-muted hover:text-text-default'
            >
              Избранное
              {favoriteCount > 0 && (
                <span className='absolute -top-1 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-xs text-white'>
                  {favoriteCount}
                </span>
              )}
            </Link>
            <Link
              to={ROUTES.cart}
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
                <Link to={ROUTES.account.base} className='text-text-muted'>
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
                          to={ROUTES.account.profile}
                          className='text-text-default block px-3 py-2 text-base hover:bg-background-muted-hover cursor-pointer'
                        >
                          Профиль
                        </Link>
                        <Link
                          to={ROUTES.account.orders}
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
                            to={ROUTES.admin.base}
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
                to={ROUTES.login}
                className='text-text-muted hover:text-text-default'
              >
                Войти
              </Link>
            )}
          </nav>

          <div className='flex items-center justify-end gap-2 lg:hidden'>
            <Button
              onClick={handleCatalogToggle}
              className='shrink-0 px-3 py-2 text-sm'
            >
              Каталог
            </Button>
            <button
              type='button'
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              className='inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border-default text-text-default'
              aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {isMobileMenuOpen ? (
                <CloseIcon className='h-5 w-5' />
              ) : (
                <MenuIcon className='h-5 w-5' />
              )}
            </button>
          </div>

          <div className='order-last w-full lg:hidden'>
            <SearchInput />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className='border-t border-border-default py-3 lg:hidden'>
            <div
              className='flex flex-col gap-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link
                to={ROUTES.favorites}
                className='flex items-center justify-between rounded px-3 py-2 text-text-default hover:bg-background-muted'
              >
                <span>Избранное</span>
                {favoriteCount > 0 && (
                  <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs text-white'>
                    {favoriteCount}
                  </span>
                )}
              </Link>
              <Link
                to={ROUTES.cart}
                className='flex items-center justify-between rounded px-3 py-2 text-text-default hover:bg-background-muted'
              >
                <span>Корзина</span>
                {cartTotalItems > 0 && (
                  <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs text-white'>
                    {cartTotalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link
                    to={ROUTES.account.profile}
                    className='rounded px-3 py-2 text-text-default hover:bg-background-muted'
                  >
                    Профиль
                  </Link>
                  <Link
                    to={ROUTES.account.orders}
                    className='rounded px-3 py-2 text-text-default hover:bg-background-muted'
                  >
                    Заказы
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to={ROUTES.admin.base}
                      className='rounded px-3 py-2 text-text-default hover:bg-background-muted'
                    >
                      Панель администратора
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='rounded px-3 py-2 text-left text-danger hover:bg-danger-subtle hover:text-danger-hover'
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link
                  to={ROUTES.login}
                  className='rounded px-3 py-2 text-text-default hover:bg-background-muted'
                >
                  Войти
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;
