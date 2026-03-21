import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { getSections } from '@/shared/api';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Spinner from '@/shared/ui/Spinner';

const CatalogPage = memo(() => {
  const { data: sections, isLoading, error } = useDataFetching(getSections);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const hoveredSection = useMemo(
    () => (sections || []).find((sec) => sec.id === hoveredSectionId),
    [hoveredSectionId, sections]
  );

  if (isLoading) {
    return (
      <div className='flex min-h-[600px] items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-[600px] items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке каталога</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className='flex min-h-[600px] gap-6'>
      {/* Categories List */}
      <div className='w-full md:w-1/4'>
        <ul className='py-12'>
          {(sections || []).map((sec) => (
            <li key={sec.id} onMouseEnter={() => setHoveredSectionId(sec.id)}>
              <Link
                to={`/catalog/${sec.id}`}
                className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-primary-subtle hover:text-primary-hover ${
                  hoveredSectionId === sec.id
                    ? 'bg-primary-subtle text-primary-hover'
                    : ''
                }`}
              >
                {sec.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories on hover */}
      <div className='relative flex w-full items-start justify-center py-12 md:w-3/4'>
        {hoveredSection ? (
          <div className='w-full'>
            <h3 className='mb-6 text-2xl font-semibold'>
              {hoveredSection.name}
            </h3>
            <ul className='grid grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-3'>
              {hoveredSection.categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog/${hoveredSection.id}/${cat.id}`}
                    className='text-base hover:text-primary hover:underline'
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='text-center'>
            <h1 className='text-2xl font-semibold text-text-default'>
              Каталог товаров
            </h1>
            <p className='mt-2 text-base text-text-muted'>
              Выберите раздел в меню слева, чтобы посмотреть доступные
              категории.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default CatalogPage;
