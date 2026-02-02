import { orders } from '@/data/orders';
import { useMemo } from 'react';

const AdminDashboardPage = () => {
  const totalOrders = orders.length;

  const totalSales = useMemo(() => {
    return orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
  }, []);

  const topProducts = useMemo(() => {
    const productCounts: Record<string, { name: string; count: number }> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productCounts[item.product.id]) {
          productCounts[item.product.id].count += item.quantity;
        } else {
          productCounts[item.product.id] = {
            name: item.product.name,
            count: item.quantity,
          };
        }
      });
    });

    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Adding some fake data for visual appeal
  const fakeData = {
    newUsers: 15,
    bounceRate: '25%',
  };

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Дашборд</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold text-gray-700'>Всего заказов</h2>
          <p className='text-3xl font-bold text-gray-900 mt-2'>{totalOrders}</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold text-gray-700'>Общая выручка</h2>
          <p className='text-3xl font-bold text-gray-900 mt-2'>
            {totalSales.toFixed(2)} ₽
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold text-gray-700'>
            Новые пользователи
          </h2>
          <p className='text-3xl font-bold text-gray-900 mt-2'>
            {fakeData.newUsers}
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold text-gray-700'>
            Процент отказов
          </h2>
          <p className='text-3xl font-bold text-gray-900 mt-2'>
            {fakeData.bounceRate}
          </p>
        </div>
      </div>

      <div className='mt-8'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold text-gray-700 mb-4'>
            Топ продаваемых товаров
          </h2>
          <ul>
            {topProducts.map((product, index) => (
              <li
                key={index}
                className='flex justify-between items-center py-2 border-b'
              >
                <span className='text-gray-600'>{product.name}</span>
                <span className='font-bold text-gray-800'>
                  {product.count} шт.
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
