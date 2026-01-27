import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';

const CatalogLayout = memo(({ onNavigate }: { onNavigate: () => void }) => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );

  const hoveredCategory = useMemo(
    () => categories.find((cat) => cat.id === hoveredCategoryId),
    [hoveredCategoryId]
  );

  return (
    <div
      className='flex flex-col md:flex-row min-h-125'
      // onMouseLeave={() => setHoveredCategoryId(null)} // Removed onMouseLeave
    >
      {/* Categories List */}
      <div className='w-full md:w-1/4 p-4 border-r'>
        <h2 className='mb-4 text-xl font-bold'>Категории</h2>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className='mb-2'
              onMouseEnter={() => setHoveredCategoryId(cat.id)} // Only set, no leave here
            >
              <Link
                to={`/catalog/${cat.id}`} // Link to product list page for category
                onClick={onNavigate}
                className={`block text-lg hover:text-blue-600 ${
                  hoveredCategoryId === cat.id ? 'font-bold text-blue-700' : ''
                }`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories on hover, moved to the right pane */}
      <div className='relative w-full md:w-3/4 p-4'>
        {hoveredCategory ? (
          <div>
            <h3 className='mb-4 text-xl font-bold'>{hoveredCategory.name}</h3>
            <ul>
              {hoveredCategory.subcategories.map((sub) => (
                <li key={sub.id} className='mb-2'>
                  <Link
                    to={`/catalog/${hoveredCategory.id}/${sub.id}`}
                    onClick={onNavigate}
                className='hover:text-blue-600'
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h1 className='mb-4 text-2xl font-bold'>Выберите категорию</h1>
            <p className='text-gray-600'>
              Наведите курсор на категорию слева, чтобы просмотреть
              подкатегории.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default CatalogLayout;
