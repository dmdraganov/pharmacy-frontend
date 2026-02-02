import { memo, useState, type ReactNode } from 'react';
import type { Order, OrderStatus } from '../types';
import Button from '@/shared/ui/Button';
import Badge from '@/shared/ui/Badge';
import { OrderItemRow } from './OrderItemRow';

interface OrderHistoryItemProps {
  order: Order;
  repeatAction?: ReactNode;
}

const statusMap: Record<OrderStatus, { text: string; className: string }> = {
  new: { text: 'Новый', className: 'bg-gray-100 text-gray-800' },
  processing: { text: 'Собирается', className: 'bg-blue-100 text-blue-800' },
  shipping: {
    text: 'Передан в доставку',
    className: 'bg-yellow-100 text-yellow-800',
  },
  delivered: { text: 'Доставлен', className: 'bg-green-100 text-green-800' },
  completed: { text: 'Завершён', className: 'bg-gray-100 text-gray-800' },
  cancelled: { text: 'Отменён', className: 'bg-red-100 text-red-800' },
};

export const OrderHistoryItem = memo(
  ({ order, repeatAction }: OrderHistoryItemProps) => {
    const { id, date, status, total, items } = order;
    const statusInfo = statusMap[status];
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className='rounded-lg border bg-white p-4 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>Заказ №{id}</span>
            <span className='text-sm text-gray-500'>
              от {new Date(date).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className='flex flex-col items-start sm:items-end'>
            <Badge className={statusInfo.className}>{statusInfo.text}</Badge>
            <span className='mt-1 text-lg font-semibold'>{total} ₽</span>
          </div>
          <div className='flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap'>
            {repeatAction}
            <Button
              variant='secondary'
              className='w-full sm:w-auto'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Скрыть состав' : 'Состав заказа'}
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className='mt-4 border-t pt-4'>
            <div className='flex flex-col divide-y'>
              {items.map((item) => (
                <OrderItemRow key={item.product.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
