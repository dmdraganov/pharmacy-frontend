import { useDataFetching } from '@/shared/hooks/useDataFetching';
import { getCategories } from '@/shared/api';
import Spinner from '@/shared/ui/Spinner';

const AdminCategoriesPage = () => {
  const { data: categories, isLoading, error } = useDataFetching(getCategories);

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке категорий</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-text-default'>Категории</h1>
        <button className='rounded bg-primary px-4 py-2 font-bold text-text-inverse hover:bg-primary-hover'>
          Добавить категорию
        </button>
      </div>
      <div className='my-6 overflow-x-auto rounded bg-background-default shadow-md'>
        {/* Desktop Table */}
        <table className='hidden min-w-full table-auto md:table'>
          <thead>
            <tr className='text-text-muted bg-background-muted text-sm uppercase leading-normal'>
              <th className='px-6 py-3 text-left'>Название категории</th>
              <th className='px-6 py-3 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light text-text-muted'>
            {(categories || []).map((category) => (
              <tr
                key={category.id}
                className='border-b border-border-default hover:bg-background-hover'
              >
                <td className='whitespace-nowrap px-6 py-3 text-left text-text-default'>
                  {category.name}
                </td>
                <td className='px-6 py-3 text-center'>
                  <div className='flex items-center justify-center space-x-2'>
                    <button className='rounded-md bg-primary-subtle px-2 py-1 text-xs text-primary-emphasis'>
                      Редактировать
                    </button>
                    <button className='rounded-md bg-danger-subtle px-2 py-1 text-xs text-danger-emphasis'>
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
          {(categories || []).map((category) => (
            <div
              key={category.id}
              className='flex items-center justify-between border-b border-border-default p-4'
            >
              <p className='font-medium text-text-default'>{category.name}</p>
              <div className='flex items-center space-x-2'>
                <button className='rounded-md bg-primary-subtle px-2 py-1 text-xs text-primary-emphasis'>
                  Р
                </button>
                <button className='rounded-md bg-danger-subtle px-2 py-1 text-xs text-danger-emphasis'>
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
