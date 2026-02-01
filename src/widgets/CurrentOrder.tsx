import { memo, useMemo } from 'react';
import { orders } from '@/data/orders';
import Badge from '@/shared/ui/Badge';
import { type OrderStatus, OrderItemRow } from '@/entities/order';

const statusMap: Record<OrderStatus, { text: string; className: string }> = {
  processing: { text: 'Собирается', className: 'bg-blue-100 text-blue-800' },
  shipping: {
    text: 'Передан в доставку',
    className: 'bg-yellow-100 text-yellow-800',
  },
  delivered: { text: 'Доставлен', className: 'bg-green-100 text-green-800' },
  completed: { text: 'Завершён', className: 'bg-gray-100 text-gray-800' },
  cancelled: { text: 'Отменён', className: 'bg-red-100 text-red-800' },
};

export const CurrentOrder = memo(() => {
  const currentOrder = useMemo(
    () =>
      orders.find(
        (order) => order.status === 'processing' || order.status === 'shipping'
      ),
    []
  );

  if (!currentOrder) {
    return null;
  }

  const { id, date, status, items, total } = currentOrder;
  const statusInfo = statusMap[status];

  return (
    <div className='rounded-lg border-2 border-blue-500 bg-white p-6 shadow-md'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>Текущий заказ</h2>
          <p className='text-gray-600'>
            №{id} от {new Date(date).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <Badge className={`${statusInfo.className} px-4 py-2 text-base`}>
          {statusInfo.text}
        </Badge>
      </div>
      <div className='my-4 border-t'></div>
      <div>
        <p className='mb-2 font-semibold'>Состав заказа:</p>
        <div className='flex flex-col divide-y'>
          {items.map((item) => (
            <OrderItemRow key={item.product.id} item={item} />
          ))}
        </div>
      </div>
      <div className='mt-4 border-t pt-4 text-right'>
        <p className='text-xl font-bold'>Итого: {total} ₽</p>
      </div>
    </div>
  );
});
