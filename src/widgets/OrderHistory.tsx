import { memo, useMemo } from 'react';
import { orders } from '@/data/orders';
import { OrderHistoryItem } from '@/entities/order';
import Button from '@/shared/ui/Button';

export const OrderHistory = memo(() => {
  const pastOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === 'completed' ||
          order.status === 'delivered' ||
          order.status === 'cancelled'
      ),
    []
  );

  if (pastOrders.length === 0) {
    return (
      <div>
        <h2 className='mb-4 text-2xl font-bold'>История заказов</h2>
        <p>Здесь будет список ваших прошлых заказов.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='mb-4 text-2xl font-bold'>История заказов</h2>
      <div className='flex flex-col gap-4'>
        {pastOrders.slice(0, 3).map((order) => (
          <OrderHistoryItem key={order.id} order={order} />
        ))}
      </div>
      {pastOrders.length > 3 && (
        <Button variant='secondary' className='mt-4' disabled>
          Показать все
        </Button>
      )}
    </div>
  );
});
