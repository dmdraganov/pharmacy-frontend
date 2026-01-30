import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { sections } from '@/data/sections';

const CatalogPage = memo(() => {
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const hoveredSection = useMemo(
    () => sections.find((sec) => sec.id === hoveredSectionId),
    [hoveredSectionId]
  );

  return (
    <div className='flex flex-col md:flex-row min-h-125'>
      {/* Categories List */}
      <div className='w-full md:w-1/4 p-4 border-r'>
        <ul>
          {sections.map((sec) => (
            <li
              key={sec.id}
              className='mb-2'
              onMouseEnter={() => setHoveredSectionId(sec.id)}
            >
              <Link
                to={`/catalog/${sec.id}`}
                className={`block text-lg hover:text-blue-600 ${
                  hoveredSectionId === sec.id ? 'font-bold text-blue-700' : ''
                }`}
              >
                {sec.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories on hover, moved to the right pane */}
      <div className='relative w-full md:w-3/4 p-4'>
        {hoveredSection ? (
          <div>
            <h3 className='mb-4 text-xl font-bold'>{hoveredSection.name}</h3>
            <ul>
              {hoveredSection.categories.map((cat) => (
                <li key={cat.id} className='mb-2'>
                  <Link
                    to={`/catalog/${hoveredSection.id}/${cat.id}`}
                    className='hover:text-blue-600'
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h1 className='mb-4 text-2xl font-bold'>Выберите раздел</h1>
            <p className='text-gray-600'>
              Наведите курсор на раздел слева, чтобы просмотреть категории.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default CatalogPage;
