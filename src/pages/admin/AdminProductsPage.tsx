import { useMemo, useCallback } from 'react';
import { getProducts, getSections } from '@/shared/api';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Spinner from '@/shared/ui/Spinner';

const AdminProductsPage = () => {
  const fetchData = useCallback(
    () => Promise.all([getProducts(), getSections()]),
    []
  );
  const { data, isLoading, error } = useDataFetching(fetchData);
  const [products, sections] = data || [[], []];

  const productsWithFakeStock = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        stock:
          product.id
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000, // Fake stock data
      })),
    [products]
  );

  const categoriesMap = useMemo(() => {
    const map = new Map<string, string>();
    sections.forEach((section) => {
      section.categories.forEach((category) => {
        map.set(category.id, category.name);
      });
    });
    return map;
  }, [sections]);

  const getCategoryName = (categoryId: string) => {
    return categoriesMap.get(categoryId) || 'N/A';
  };

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
        <h2 className='text-2xl font-bold'>Ошибка при загрузке данных</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-text-default'>Товары</h1>
        <button className='rounded bg-primary px-4 py-2 font-bold text-text-inverse hover:bg-primary-hover'>
          Добавить товар
        </button>
      </div>
      <div className='my-6 overflow-x-auto rounded bg-background-default shadow-md'>
        {/* Desktop Table */}
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
            {productsWithFakeStock.map((product) => (
              <tr
                key={product.id}
                className='border-b border-border-default hover:bg-background-hover'
              >
                <td className='whitespace-nowrap px-6 py-3 text-left text-text-default'>
                  {product.name}
                </td>
                <td className='px-6 py-3 text-left text-text-default'>
                  {getCategoryName(product.categoryId)}
                </td>
                <td className='px-6 py-3 text-center text-text-default'>
                  {product.price} ₽
                </td>
                <td className='px-6 py-3 text-center text-text-default'>
                  {product.stock}
                </td>
                <td className='px-6 py-3 text-center text-text-default'>
                  {product.isPrescription ? 'Да' : 'Нет'}
                </td>
                <td className='px-6 py-3 text-center'>
                  <div className='flex items-center justify-center'>
                    <button className='mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary-emphasis'>
                      Р
                    </button>
                    <button className='flex h-8 w-8 items-center justify-center rounded-full bg-danger-subtle text-danger-emphasis'>
                      У
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className='md:hidden'>
          {productsWithFakeStock.map((product) => (
            <div
              key={product.id}
              className='border-b border-border-default p-4'
            >
              <h3 className='mb-2 text-lg font-bold text-text-default'>
                {product.name}
              </h3>
              <div className='space-y-1 text-sm'>
                <p>
                  <span className='font-semibold'>Категория: </span>
                  {getCategoryName(product.categoryId)}
                </p>
                <p>
                  <span className='font-semibold'>Цена: </span>
                  {product.price} ₽
                </p>
                <p>
                  <span className='font-semibold'>В наличии: </span>
                  {product.stock}
                </p>
                <p>
                  <span className='font-semibold'>Рецептурный: </span>
                  {product.isPrescription ? 'Да' : 'Нет'}
                </p>
              </div>
              <div className='mt-4 flex items-center'>
                <button className='mr-2 rounded-md bg-primary-subtle px-4 py-2 text-sm text-primary-emphasis'>
                  Редактировать
                </button>
                <button className='rounded-md bg-danger-subtle px-4 py-2 text-sm text-danger-emphasis'>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
