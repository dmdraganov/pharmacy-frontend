import type { Product } from '@/entities/product';
import type { InventoryItem } from '@/shared/api';
import Button from '@/shared/ui/Button';

interface ProductListProps {
  products: Product[];
  inventoryByProductId: Map<string, InventoryItem>;
  categoryNameById: Map<string, string>;
  isDeleting: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const getAvailableStock = (inventory?: InventoryItem) =>
  inventory ? inventory.stockQuantity - inventory.reservedQuantity : undefined;

export const ProductList = ({
  products,
  inventoryByProductId,
  categoryNameById,
  isDeleting,
  onEdit,
  onDelete,
}: ProductListProps) => (
  <div className='my-6 overflow-x-auto rounded bg-background-default shadow-md'>
    <table className='hidden min-w-full table-auto md:table'>
      <thead>
        <tr className='text-text-muted bg-background-muted text-sm uppercase leading-normal'>
          <th className='px-6 py-3 text-left'>Название</th>
          <th className='px-6 py-3 text-left'>Категория</th>
          <th className='px-6 py-3 text-center'>Цена</th>
          <th className='px-6 py-3 text-center'>В наличии</th>
          <th className='px-6 py-3 text-center'>Рецептурный</th>
          <th className='px-6 py-3 text-center'>Действия</th>
        </tr>
      </thead>
      <tbody className='text-sm font-light text-text-muted'>
        {products.map((product) => {
          const availableStock = getAvailableStock(
            inventoryByProductId.get(product.id)
          );

          return (
            <tr
              key={product.id}
              className='border-b border-border-default hover:bg-background-muted-hover'
            >
              <td className='whitespace-nowrap px-6 py-3 text-left text-text-default'>
                {product.name}
              </td>
              <td className='px-6 py-3 text-left text-text-default'>
                {categoryNameById.get(product.categoryId) || 'N/A'}
              </td>
              <td className='px-6 py-3 text-center text-text-default'>
                {product.price} ₽
              </td>
              <td className='px-6 py-3 text-center text-text-default'>
                {availableStock ?? '—'}
              </td>
              <td className='px-6 py-3 text-center text-text-default'>
                {product.isPrescription ? 'Да' : 'Нет'}
              </td>
              <td className='px-6 py-3 text-center'>
                <div className='flex items-center justify-center gap-2'>
                  <Button
                    size='small'
                    variant='secondary'
                    onClick={() => onEdit(product)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    size='small'
                    variant='danger'
                    onClick={() => onDelete(product)}
                    disabled={isDeleting}
                  >
                    Удалить
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <div className='md:hidden'>
      {products.map((product) => {
        const availableStock = getAvailableStock(
          inventoryByProductId.get(product.id)
        );

        return (
          <div key={product.id} className='border-b border-border-default p-4'>
            <h3 className='mb-2 break-words text-lg font-bold text-text-default'>
              {product.name}
            </h3>
            <div className='space-y-1 text-sm'>
              <p>
                <span className='font-semibold'>Категория: </span>
                {categoryNameById.get(product.categoryId) || 'N/A'}
              </p>
              <p>
                <span className='font-semibold'>Цена: </span>
                {product.price} ₽
              </p>
              <p>
                <span className='font-semibold'>В наличии: </span>
                {availableStock ?? '—'}
              </p>
              <p>
                <span className='font-semibold'>Рецептурный: </span>
                {product.isPrescription ? 'Да' : 'Нет'}
              </p>
            </div>
            <div className='mt-4 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center'>
              <Button
                size='small'
                variant='secondary'
                onClick={() => onEdit(product)}
              >
                Редактировать
              </Button>
              <Button
                size='small'
                variant='danger'
                onClick={() => onDelete(product)}
                disabled={isDeleting}
              >
                Удалить
              </Button>
            </div>
          </div>
        );
      })}
    </div>

    {products.length === 0 && (
      <p className='p-6 text-center text-text-muted'>Товаров пока нет.</p>
    )}
  </div>
);
