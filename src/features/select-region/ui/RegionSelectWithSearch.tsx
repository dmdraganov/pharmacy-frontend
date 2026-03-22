import { memo, useState } from 'react';
import { useRegionStore } from '@/features/select-region';
import Input from '@/shared/ui/Input';
import { Dropdown } from '@/shared/ui/Dropdown';
import { REGIONS } from '../lib/constants';

export const RegionSelectWithSearch = memo(() => {
  const { region, setRegion } = useRegionStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegions = REGIONS.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dropdown triggerOn='click'>
      {(isOpen, _open, close, toggle) => {
        const handleRegionSelect = (selectedRegion: string) => {
          setRegion(selectedRegion);
          setSearchTerm('');
          close(true); // Close dropdown immediately
        };

        return (
          <>
            <button
              type='button'
              onClick={toggle}
              className='flex items-center gap-1 rounded-md border-none text-sm text-text-default outline-none cursor-pointer'
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
              <div className='absolute left-0 mt-2 w-64 rounded-md border border-border-default bg-background-default shadow-lg'>
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
                            className='block w-full px-3 py-2 text-left hover:bg-background-muted-hover cursor-pointer'
                          >
                            {r}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className='px-3 py-2 text-text-muted'>
                        Регион не найден
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </>
        );
      }}
    </Dropdown>
  );
});
