import { sections } from '@/data/sections';
import type { Category } from '@/entities/section/types';

const AdminCategoriesPage = () => {
  const allCategories: Category[] = sections.flatMap(
    (section) => section.categories
  );

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Категории</h1>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Добавить категорию
        </button>
      </div>
      <div className='bg-white shadow-md rounded my-6'>
        <table className='min-w-full table-auto'>
          <thead>
            <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>Название категории</th>
              <th className='py-3 px-6 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-gray-600 text-sm font-light'>
            {allCategories.map((category) => (
              <tr
                key={category.id}
                className='border-b border-gray-200 hover:bg-gray-100'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap'>
                  {category.name}
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex item-center justify-center'>
                    <button className='w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center'>
                      У
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
