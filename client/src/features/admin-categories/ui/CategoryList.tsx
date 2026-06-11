import type { Category } from '@/entities/section';
import Button from '@/shared/ui/Button';

interface CategoryListProps {
  categories: Category[];
  sectionNameById: Map<string, string>;
  isDeleting: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryList = ({
  categories,
  sectionNameById,
  isDeleting,
  onEdit,
  onDelete,
}: CategoryListProps) => (
  <div className='my-6 overflow-x-auto rounded bg-background-default shadow-md'>
    <table className='hidden min-w-full table-auto md:table'>
      <thead>
        <tr className='text-text-muted bg-background-muted text-sm uppercase leading-normal'>
          <th className='px-6 py-3 text-left'>Название категории</th>
          <th className='px-6 py-3 text-left'>Раздел</th>
          <th className='px-6 py-3 text-center'>Действия</th>
        </tr>
      </thead>
      <tbody className='text-sm font-light text-text-muted'>
        {categories.map((category) => (
          <tr
            key={category.id}
            className='border-b border-border-default hover:bg-background-muted-hover'
          >
            <td className='whitespace-nowrap px-6 py-3 text-left text-text-default'>
              {category.name}
            </td>
            <td className='px-6 py-3 text-left text-text-default'>
              {sectionNameById.get(category.sectionId) || 'N/A'}
            </td>
            <td className='px-6 py-3 text-center'>
              <div className='flex items-center justify-center gap-2'>
                <Button
                  size='small'
                  variant='secondary'
                  onClick={() => onEdit(category)}
                >
                  Редактировать
                </Button>
                <Button
                  size='small'
                  variant='danger'
                  onClick={() => onDelete(category)}
                  disabled={isDeleting}
                >
                  Удалить
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className='md:hidden'>
      {categories.map((category) => (
        <div
          key={category.id}
          className='flex flex-col gap-3 border-b border-border-default p-4'
        >
          <div>
            <p className='break-words font-medium text-text-default'>
              {category.name}
            </p>
            <p className='text-sm text-text-muted'>
              {sectionNameById.get(category.sectionId) || 'N/A'}
            </p>
          </div>
          <div className='flex flex-col gap-2 min-[420px]:flex-row'>
            <Button
              size='small'
              variant='secondary'
              onClick={() => onEdit(category)}
            >
              Редактировать
            </Button>
            <Button
              size='small'
              variant='danger'
              onClick={() => onDelete(category)}
              disabled={isDeleting}
            >
              Удалить
            </Button>
          </div>
        </div>
      ))}
    </div>

    {categories.length === 0 && (
      <p className='p-6 text-center text-text-muted'>Категорий пока нет.</p>
    )}
  </div>
);
