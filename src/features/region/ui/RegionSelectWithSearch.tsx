import { memo, useState, useEffect, useRef } from 'react';
import { useRegion } from '@/features/region';
import Input from '@/shared/ui/Input';
import { REGIONS } from '../lib/constants';

export const RegionSelectWithSearch = memo(() => {
  const { region, setRegion } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredRegions = REGIONS.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegionSelect = (selectedRegion: string) => {
    setRegion(selectedRegion);
    setIsOpen(false);
    setSearchTerm(''); // Clear search term after selection
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 rounded-md border-none bg-gray-100 text-sm text-gray-700 outline-none hover:cursor-pointer'
      >
        <span>{region}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`h-4 w-4 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute left-0 mt-2 w-64 rounded-md border bg-white shadow-lg'>
          <div className='p-2'>
            <Input
              type='text'
              placeholder='Поиск региона...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='mb-2'
            />
            <ul className='max-h-60 overflow-y-auto'>
              {filteredRegions.length > 0 ? (
                filteredRegions.map((r) => (
                  <li key={r}>
                    <button
                      type='button'
                      onClick={() => handleRegionSelect(r)}
                      className='block w-full px-3 py-2 text-left hover:bg-gray-100'
                    >
                      {r}
                    </button>
                  </li>
                ))
              ) : (
                <li className='px-3 py-2 text-gray-500'>Регион не найден</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});
