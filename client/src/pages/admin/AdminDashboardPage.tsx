import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminOrders } from '@/shared/api';
import Spinner from '@/shared/ui/Spinner';

const AdminDashboardPage = () => {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: getAdminOrders,
  });

  const totalOrders = orders.length;

  const totalSales = useMemo(() => {
    return orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        ['new', 'processing', 'shipping'].includes(order.status)
      ).length,
    [orders]
  );

  const prescriptionOrders = useMemo(
    () =>
      orders.filter((order) =>
        order.items.some((item) => item.product.isPrescription)
      ).length,
    [orders]
  );

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
        <p>Не удалось загрузить данные дашборда.</p>
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
            Активные заказы
          </h2>
          <p className='mt-2 text-3xl font-bold text-text-default'>
            {activeOrders}
          </p>
        </div>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='text-lg font-medium text-text-muted'>
            С рецептурными товарами
          </h2>
          <p className='mt-2 text-3xl font-bold text-text-default'>
            {prescriptionOrders}
          </p>
        </div>
      </div>

      <div className='mt-8'>
        <div className='rounded-lg border bg-background-default p-6'>
          <h2 className='mb-4 text-lg font-medium text-text-muted'>
            Топ продаваемых товаров
          </h2>
          {topProducts.length > 0 ? (
            <ul>
              {topProducts.map((product) => (
                <li
                  key={product.name}
                  className='flex items-center justify-between border-b py-2'
                >
                  <span className='text-text-muted'>{product.name}</span>
                  <span className='font-bold text-text-default'>
                    {product.count} шт.
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-text-muted'>Нет данных по продажам.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
