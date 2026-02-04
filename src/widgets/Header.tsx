import { memo, useState, useEffect } from 'react';
import Logo from '@/shared/ui/Logo';
import Button from '@/shared/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { RegionSelectWithSearch } from '@/features/region';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className='container max-w-[1280px] mx-auto px-3 md:px-4 lg:px-6'>
        {/* Top Row: Region Selector */}
        <div
          className={`flex justify-start transition-all duration-300 ease-in-out ${
            isScrolled ? 'max-h-0 pt-0 opacity-0' : 'max-h-16 pt-4 opacity-100'
          }`}
        >
          <RegionSelectWithSearch />
        </div>

        {/* Bottom Row: Logo, Search, Navigation */}
        <div className='flex items-center justify-between py-4'>
          <Logo />

          <div className='flex flex-1 items-center justify-center gap-4 px-8'>
            <Button onClick={handleCatalogToggle}>Каталог</Button>
            <SearchInput />
          </div>

          <nav className='flex items-center space-x-4'>
            <Link
              to='/favorites'
              className='text-text-muted hover:text-text-heading'
            >
              Избранное
            </Link>
            <Link
              to='/cart'
              className='text-text-muted hover:text-text-heading'
            >
              Корзина
            </Link>
            <Link
              to='/account'
              className='text-text-muted hover:text-text-heading'
            >
              Личный кабинет
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
