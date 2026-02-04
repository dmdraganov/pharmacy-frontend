import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@/shared/ui/SearchIcon';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

export const SearchInput = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className='relative w-full max-w-sm'>
      <Input
        placeholder='Поиск'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='pr-12'
      />
      <Button
        type='submit'
        variant='ghost'
        className='absolute inset-y-0 right-0 rounded-l-none px-4'
      >
        <SearchIcon className='h-5 w-5 text-muted-foreground' />
      </Button>
    </form>
  );
};
