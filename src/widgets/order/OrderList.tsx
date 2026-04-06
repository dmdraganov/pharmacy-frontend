import { memo, useState } from 'react';
import Badge, { type BadgeVariant } from '@/shared/ui/Badge';
import { type Order, type OrderStatus, OrderItemRow } from '@/entities/order';
import { getProductImage } from '@/entities/product';
import Button from '@/shared/ui/Button';

const statusMap: Record<OrderStatus, { text: string; variant: BadgeVariant }> =
  {
    new: { text: 'Новый', variant: 'secondary' },
    processing: { text: 'В сборке', variant: 'primary' },
    shipping: { text: 'В пути', variant: 'warning' },
    delivered: { text: 'Доставлен', variant: 'success' },
    completed: { text: 'Завершён', variant: 'secondary' },
    cancelled: { text: 'Отменён', variant: 'danger' },
  };

interface OrderListProps {
  orders: Order[];
}

const OrderCard = memo(({ order }: { order: Order }) => {
  const {
    id,
    date,
    status,
    items,
    total,
    deliveryInfo,
    paymentMethod,
    deliveryMethod,
  } = order;
  const statusInfo = statusMap[status];
  const [isExpanded, setIsExpanded] = useState(false);

  const previewItems = items.slice(0, 2);
  const remainingItemsCount = items.length - previewItems.length;

  const requiresPrescription = items.some(
    (item) => item.product.isPrescription
  );
  const paymentMethodText =
    paymentMethod === 'online'
      ? 'Картой онлайн'
      : 'Картой или наличными при получении';

  const deliveryMethodText =
    deliveryMethod === 'delivery' ? 'Курьером' : 'Самовывоз';

  return (
    <div className='overflow-hidden rounded-xl border border-border-default bg-background-default shadow-sm transition-shadow hover:shadow-md'>
      {/* Top Row */}
      <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-background-secondary p-4'>
        <div className='flex items-center gap-4'>
          <span className='font-bold text-text-default'>
            Заказ №{id.slice(-6)}
          </span>
          <span className='text-sm text-text-muted'>
            от {new Date(date).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <Badge variant={statusInfo.variant} className='px-3 py-1 text-sm'>
          {statusInfo.text}
        </Badge>
      </div>

      <div className='p-4'>
        {/* Product Preview & Medical Indicators */}
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='flex-grow'>
            <h3 className='mb-2 text-sm font-semibold text-text-muted'>
              Состав заказа
            </h3>
            <div className='flex items-center gap-3'>
              <div className='flex -space-x-2'>
                {previewItems.map((item) => (
                  <img
                    key={item.product.id}
                    src={getProductImage(item.product.image)}
                    alt={item.product.name}
                    className='h-10 w-10 rounded-full border-2 border-white object-cover'
                  />
                ))}
              </div>
              <div className='text-sm text-text-default'>
                {previewItems.map((item) => item.product.name).join(', ')}
                {remainingItemsCount > 0 && (
                  <span className='ml-1 text-text-muted'>
                    + ещё {remainingItemsCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className='flex flex-shrink-0 items-start gap-2 sm:items-end sm:flex-col'>
            {requiresPrescription && (
              <Badge variant='warning'>Требуется рецепт</Badge>
            )}
          </div>
        </div>

        <div className='my-4 h-px bg-border-default' />

        {/* Delivery & Total */}
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
          <div>
            <h3 className='mb-1 text-sm font-semibold text-text-muted'>
              {deliveryMethodText}
            </h3>
            <p className='text-sm text-text-default'>{deliveryInfo}</p>
          </div>
          <div className='text-left sm:text-right'>
            <h3 className='mb-1 text-sm font-semibold text-text-muted'>Итог</h3>
            <p className='text-lg font-bold text-text-default'>{total} ₽</p>
            <p className='text-xs text-text-muted'>{paymentMethodText}</p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className='border-t border-border-default bg-background-secondary p-4'>
          <h3 className='mb-4 text-md font-semibold text-text-default'>
            Подробный состав заказа
          </h3>
          <div className='flex flex-col gap-3'>
            {items.map((item) => (
              <OrderItemRow key={item.product.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className='flex gap-px border-t border-border-default bg-border-default'>
        <Button
          variant='ghost'
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex-1 rounded-none bg-background-default'
        >
          {isExpanded ? 'Скрыть' : 'Подробнее'}
        </Button>
      </div>
    </div>
  );
});

export const OrderList = memo(({ orders }: OrderListProps) => {
  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col gap-6'>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
});
