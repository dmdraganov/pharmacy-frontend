import { memo, useState, useEffect } from 'react';
import Logo from '@/shared/ui/Logo';
import Button from '@/shared/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { RegionSelectWithSearch } from '@/features/select-region';
import { useCartTotals } from '@/features/cart';
import { useFavoriteIds } from '@/features/favorites';

import { useAuthStore } from '@/features/auth';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems: cartTotalItems } = useCartTotals();
  const favoriteIds = useFavoriteIds();
  const { user, logout } = useAuthStore();

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
              <>
                <Link
                  to='/account'
                  className='text-text-muted hover:text-text-default'
                >
                  {user.firstName}
                </Link>
                <Button variant='secondary' size='small' onClick={logout}>
                  Выйти
                </Button>
              </>
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
