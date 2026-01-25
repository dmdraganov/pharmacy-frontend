import { useState, useRef, useEffect, memo } from 'react';
import Logo from '@/shared/ui/Logo';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import { useSearch, SearchResults } from '@/features/search';
import { useRegion } from '@/features/region'; // New import

const Header = memo(() => {
  const { searchTerm, setSearchTerm, searchResults } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { region, setRegion } = useRegion(); // Using the region context

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true); // Show results when typing
  };

  const handleResultClick = () => {
    setShowResults(false); // Hide results when a result is clicked
    setSearchTerm(''); // Clear search term after selection
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  return (
    <header className='border-b'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        <Logo />

        <div
          className='relative flex flex-1 items-center justify-center gap-4 px-8'
          ref={searchRef}
        >
          <Link to='/catalog'>
            <Button>Каталог</Button>
          </Link>
          <div className='w-full max-w-sm'>
            <Input
              placeholder='Поиск...'
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowResults(true)} // Show results if there are any, on focus
            />
            {searchTerm && showResults && (
              <SearchResults
                results={searchResults}
                onResultClick={handleResultClick}
              />
            )}
          </div>
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
