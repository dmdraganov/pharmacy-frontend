import { sections } from '@/data/sections';
import type { Category } from '@/entities/section/types';

const AdminCategoriesPage = () => {
  const allCategories: Category[] = sections.flatMap(
    (section) => section.categories
  );

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-text-heading'>Категории</h1>
        <button className='bg-primary hover:bg-primary-hover text-text-inverse font-bold py-2 px-4 rounded'>
          Добавить категорию
        </button>
      </div>
      <div className='bg-background-default shadow-md rounded my-6 overflow-x-auto'>
        {/* Desktop Table */}
        <table className='min-w-full table-auto hidden md:table'>
          <thead>
            <tr className='bg-background-muted text-text-muted uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>Название категории</th>
              <th className='py-3 px-6 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-text-muted text-sm font-light'>
            {allCategories.map((category) => (
              <tr
                key={category.id}
                className='border-b border-border-default hover:bg-background-hover'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap text-text-default'>
                  {category.name}
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex items-center justify-center space-x-2'>
                    <button className='py-1 px-2 text-xs rounded-md bg-primary-subtle text-primary-emphasis'>
                      Редактировать
                    </button>
                    <button className='py-1 px-2 text-xs rounded-md bg-danger-subtle text-danger-emphasis'>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className='md:hidden'>
          {allCategories.map((category) => (
            <div
              key={category.id}
              className='p-4 border-b border-border-default flex justify-between items-center'
            >
              <p className='text-text-default font-medium'>{category.name}</p>
              <div className='flex items-center space-x-2'>
                <button className='py-1 px-2 text-xs rounded-md bg-primary-subtle text-primary-emphasis'>
                  Р
                </button>
                <button className='py-1 px-2 text-xs rounded-md bg-danger-subtle text-danger-emphasis'>
                  У
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
