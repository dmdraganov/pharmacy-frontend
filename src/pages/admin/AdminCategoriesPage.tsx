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
        <button className='bg-primary hover:bg-primary-hover text-text-on-primary font-bold py-2 px-4 rounded'>
          Добавить категорию
        </button>
      </div>
      <div className='bg-background-default shadow-md rounded my-6'>
        <table className='min-w-full table-auto'>
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
                className='border-b border-border-subtle hover:bg-background-hover'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap text-text-default'>
                  {category.name}
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex items-center justify-center'>
                    <button className='w-8 h-8 rounded-full bg-danger text-text-on-danger flex items-center justify-center'>
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
