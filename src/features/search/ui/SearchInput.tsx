import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <form onSubmit={handleSearch} className='flex w-full max-w-sm'>
      <Input
        placeholder='Поиск...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='rounded-r-none'
      />
      <Button type='submit' className='rounded-l-none'>
        Найти
      </Button>
    </form>
  );
};
