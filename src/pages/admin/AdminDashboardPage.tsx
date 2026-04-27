import { useEffect, useMemo } from 'react';
import { useOrderStore } from '@/entities/order';
import Spinner from '@/shared/ui/Spinner';

const AdminDashboardPage = () => {
  const { orders, _seedInitialOrders } = useOrderStore();

  // Ensure data is seeded
  useEffect(() => {
    _seedInitialOrders();
  }, [_seedInitialOrders]);

  const totalOrders = orders.length;

  const totalSales = useMemo(() => {
    return orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

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
  }, [orders]);

  // Adding some fake data for visual appeal
  const fakeData = {
    newUsers: 15,
    bounceRate: '25%',
  };

  if (orders.length === 0) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
        <p className='ml-4'>Загрузка данных о заказах...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='mb-6 text-3xl font-semibold'>Дашборд</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='text-lg font-medium text-text-muted'>Всего заказов</h2>
          <p className='mt-2 text-3xl font-bold text-text-default'>
            {totalOrders}
          </p>
        </div>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='text-lg font-medium text-text-muted'>Общая выручка</h2>
          <p className='mt-2 text-3xl font-bold text-text-default'>
            {totalSales.toFixed(2)} ₽
          </p>
        </div>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='text-lg font-medium text-text-muted'>
            Новые пользователи
          </h2>
          <p className='mt-2 text-3xl font-bold text-text-default'>
            {fakeData.newUsers}
          </p>
        </div>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='text-lg font-medium text-text-muted'>
            Процент отказов
          </h2>
          <p className='mt-2 text-3xl font-bold text-text-default'>
            {fakeData.bounceRate}
          </p>
        </div>
      </div>

      <div className='mt-8'>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='mb-4 text-lg font-medium text-text-muted'>
            Топ продаваемых товаров
          </h2>
          <ul>
            {topProducts.map((product, index) => (
              <li
                key={index}
                className='flex items-center justify-between border-b py-2'
              >
                <span className='text-text-muted'>{product.name}</span>
                <span className='font-bold text-text-default'>
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
