import { memo, useState, type ReactNode } from 'react';
import type { Order, OrderStatus } from '../types';
import Button from '@/shared/ui/Button';
import Badge from '@/shared/ui/Badge';
import { OrderItemRow } from './OrderItemRow';

import type { BadgeVariant } from '@/shared/ui/Badge';

// ... (imports)

interface OrderHistoryItemProps {
  order: Order;
  repeatAction?: ReactNode;
}

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

export const OrderHistoryItem = memo(
  ({ order, repeatAction }: OrderHistoryItemProps) => {
    const { id, date, status, total, items } = order;
    const statusInfo = statusMap[status];
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div className='rounded-lg border border-border-default bg-background-default p-4 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>Заказ №{id}</span>
            <span className='text-sm text-text-subtle'>
              от {new Date(date).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <div className='flex flex-col items-start sm:items-end'>
            <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
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
          <div className='mt-4 border-t border-border-default pt-4'>
            <div className='flex flex-col divide-y divide-border-default'>
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
