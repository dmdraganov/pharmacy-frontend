import { memo } from 'react';
import Logo from '@/shared/ui/Logo';
import Button from '@/shared/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchInput } from '@/features/search';
import { useRegion } from '@/features/region';

const Header = memo(() => {
  const { region, setRegion } = useRegion();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };

  const handleCatalogToggle = () => {
    if (location.pathname === '/catalog') {
      navigate(-1);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <header className='sticky top-0 z-50 border-b bg-white'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        <Logo />

        <div className='flex flex-1 items-center justify-center gap-4 px-8'>
          <Button onClick={handleCatalogToggle}>Каталог</Button>
          <SearchInput />
        </div>

        <nav className='flex items-center space-x-4'>
          <select
            value={region}
            onChange={handleRegionChange}
            className='rounded border p-1'
          >
            <option value='Москва'>Москва</option>
            <option value='Санкт-Петербург'>Санкт-Петербург</option>
            <option value='Казань'>Казань</option>
          </select>
          <Link to='/favorites' className='text-gray-500 hover:text-gray-900'>
            Избранное
          </Link>
          <Link to='/cart' className='text-gray-500 hover:text-gray-900'>
            Корзина
          </Link>
          <Link to='/delivery' className='text-gray-500 hover:text-gray-900'>
            Доставка
          </Link>
        </nav>
      </div>
    </header>
  );
});

export default Header;
