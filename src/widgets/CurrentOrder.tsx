import { memo, useMemo } from 'react';
import { orders } from '@/data/orders';
import Badge, { type BadgeVariant } from '@/shared/ui/Badge';
import { type OrderStatus, OrderItemRow } from '@/entities/order';

const statusMap: Record<OrderStatus, { text: string; variant: BadgeVariant }> =
  {
    new: { text: 'Новый', variant: 'secondary' },
    processing: { text: 'Собирается', variant: 'primary' },
    shipping: {
      text: 'Передан в доставку',
      variant: 'warning',
    },
    delivered: { text: 'Доставлен', variant: 'success' },
    completed: { text: 'Завершён', variant: 'secondary' },
    cancelled: { text: 'Отменён', variant: 'danger' },
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
    <div className='rounded-lg border-2 border-primary bg-background-default p-6 shadow-md'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold'>Текущий заказ</h2>
          <p className='text-text-muted'>
            №{id} от {new Date(date).toLocaleDateString('ru-RU')}
          </p>
        </div>
        <Badge variant={statusInfo.variant} className='px-4 py-2 text-base'>
          {statusInfo.text}
        </Badge>
      </div>
      <div className='my-4 border-t border-border-default'></div>
      <div>
        <p className='mb-2 font-semibold'>Состав заказа:</p>
        <div className='flex flex-col divide-y divide-border-default'>
          {items.map((item) => (
            <OrderItemRow key={item.product.id} item={item} />
          ))}
        </div>
      </div>
      <div className='mt-4 border-t border-border-default pt-4 text-right'>
        <p className='text-xl font-bold'>Итого: {total} ₽</p>
      </div>
    </div>
  );
});
