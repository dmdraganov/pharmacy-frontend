import { products } from '@/data/products';
import { sections } from '@/data/sections';
import { useMemo } from 'react';

const productsWithFakeStock = products.map((product) => ({
  ...product,
  stock: Math.floor(Math.random() * 1000), // Fake stock data
}));

const AdminProductsPage = () => {
  const categoriesMap = useMemo(() => {
    const map = new Map<string, string>();
    sections.forEach((section) => {
      section.categories.forEach((category) => {
        map.set(category.id, category.name);
      });
    });
    return map;
  }, []);

  const getCategoryName = (categoryId: string) => {
    return categoriesMap.get(categoryId) || 'N/A';
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-text-heading'>Товары</h1>
        <button className='bg-primary hover:bg-primary-hover text-text-inverse font-bold py-2 px-4 rounded'>
          Добавить товар
        </button>
      </div>
      <div className='bg-background-default shadow-md rounded my-6 overflow-x-auto'>
        {/* Desktop Table */}
        <table className='min-w-full table-auto hidden md:table'>
          <thead>
            <tr className='bg-background-muted text-text-muted uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>Название</th>
              <th className='py-3 px-6 text-left'>Категория</th>
              <th className='py-3 px-6 text-center'>Цена</th>
              <th className='py-3 px-6 text-center'>В наличии</th>
              <th className='py-3 px-6 text-center'>Рецептурный</th>
              <th className='py-3 px-6 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-text-muted text-sm font-light'>
            {productsWithFakeStock.map((product) => (
              <tr
                key={product.id}
                className='border-b border-border-default hover:bg-background-hover'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap text-text-default'>
                  {product.name}
                </td>
                <td className='py-3 px-6 text-left text-text-default'>
                  {getCategoryName(product.categoryId)}
                </td>
                <td className='py-3 px-6 text-center text-text-default'>
                  {product.price} ₽
                </td>
                <td className='py-3 px-6 text-center text-text-default'>
                  {product.stock}
                </td>
                <td className='py-3 px-6 text-center text-text-default'>
                  {product.isPrescription ? 'Да' : 'Нет'}
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex items-center justify-center'>
                    <button className='w-8 h-8 rounded-full bg-primary-subtle text-primary-emphasis flex items-center justify-center mr-2'>
                      Р
                    </button>
                    <button className='w-8 h-8 rounded-full bg-danger-subtle text-danger-emphasis flex items-center justify-center'>
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
              className='p-4 border-b border-border-default'
            >
              <h3 className='font-bold text-lg mb-2 text-text-default'>
                {product.name}
              </h3>
              <div className='text-sm space-y-1'>
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
              <div className='flex items-center mt-4'>
                <button className='py-2 px-4 text-sm rounded-md bg-primary-subtle text-primary-emphasis mr-2'>
                  Редактировать
                </button>
                <button className='py-2 px-4 text-sm rounded-md bg-danger-subtle text-danger-emphasis'>
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
