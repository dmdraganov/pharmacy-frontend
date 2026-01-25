import { Link } from 'react-router-dom';
import type { Product } from '@/entities/product/model';

interface SearchResultsProps {
  results: Product[];
  onResultClick: () => void;
}

const SearchResults = ({ results, onResultClick }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className='absolute left-0 right-0 top-full z-10 mt-2 rounded-md border bg-white p-4 shadow-lg'>
        <p className='text-gray-500'>Ничего не найдено.</p>
      </div>
    );
  }

  return (
    <div className='absolute left-0 right-0 top-full z-10 mt-2 max-h-80 overflow-y-auto rounded-md border bg-white shadow-lg'>
      {results.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          onClick={onResultClick}
          className='flex items-center gap-4 border-b p-2 last:border-b-0 hover:bg-gray-100'
        >
          <img
            src={product.image}
            alt={product.name}
            className='h-10 w-10 rounded object-cover'
          />
          <div>
            <p className='font-semibold'>{product.name}</p>
            <p className='text-sm text-gray-500'>{product.brand}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
