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
        <button className='bg-primary hover:bg-primary-hover text-text-on-primary font-bold py-2 px-4 rounded'>
          Добавить товар
        </button>
      </div>
      <div className='bg-background-default shadow-md rounded my-6'>
        <table className='min-w-full table-auto'>
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
                    <button className='w-8 h-8 rounded-full bg-primary text-text-on-primary flex items-center justify-center mr-2'>
                      Р
                    </button>
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

export default AdminProductsPage;
