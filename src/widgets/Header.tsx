import { memo } from 'react';
import Logo from '@/shared/ui/Logo';
import Button from '@/shared/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { RegionSelectWithSearch } from '@/features/region';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCatalogToggle = () => {
    if (location.pathname === '/catalog') {
      navigate(-1);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <header className='sticky top-0 z-50 border-b bg-white'>
      {/* Top Row: Region Selector */}
      <div className='container mx-auto flex justify-start px-4 pt-4'>
        <RegionSelectWithSearch />
      </div>

      {/* Bottom Row: Logo, Search, Navigation */}
      <div className='container mx-auto flex items-center justify-between p-4 pt-2'>
        <Logo />

        <div className='flex flex-1 items-center justify-center gap-4 px-8'>
          <Button onClick={handleCatalogToggle}>Каталог</Button>
          <SearchInput />
        </div>

        <nav className='flex items-center space-x-4'>
          <Link to='/favorites' className='text-gray-500 hover:text-gray-900'>
            Избранное
          </Link>
          <Link to='/cart' className='text-gray-500 hover:text-gray-900'>
            Корзина
          </Link>
          <Link to='/account' className='text-gray-500 hover:text-gray-900'>
            Личный кабинет
          </Link>
        </nav>
      </div>
    </header>
  );
});

export default Header;
