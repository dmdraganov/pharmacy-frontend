import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '@/shared/api';
import { OrderHistoryItem, type Order } from '@/entities/order';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import { useCart } from '@/features/cart';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import { RepeatOrderButton } from '@/features/repeat-order';

export const OrderHistory = memo(() => {
  const { data: orders, isLoading, error } = useDataFetching(getOrders);
  const { addItemsToCart } = useCart();
  const navigate = useNavigate();

  const handleRepeatOrder = (order: Order) => {
    addItemsToCart(order.items);
    navigate('/cart');
  };

  const pastOrders = useMemo(
    () =>
      (orders || []).filter(
        (order) =>
          order.status === 'completed' ||
          order.status === 'delivered' ||
          order.status === 'cancelled'
      ),
    [orders]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex h-48 items-center justify-center'>
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <p className='text-center text-danger'>
          Не удалось загрузить историю заказов.
        </p>
      );
    }

    if (pastOrders.length === 0) {
      return (
        <p className='text-text-default'>
          Здесь будет список ваших прошлых заказов.
        </p>
      );
    }

    return (
      <>
        <div className='flex flex-col gap-4'>
          {pastOrders.slice(0, 3).map((order) => (
            <OrderHistoryItem
              key={order.id}
              order={order}
              repeatAction={
                (order.status === 'completed' ||
                  order.status === 'cancelled') && (
                  <RepeatOrderButton
                    order={order}
                    className='w-full sm:w-auto'
                    onRepeatOrder={handleRepeatOrder}
                  />
                )
              }
            />
          ))}
        </div>
        {pastOrders.length > 3 && (
          <Button variant='secondary' className='mt-4' disabled>
            Показать все
          </Button>
        )}
      </>
    );
  };

  return (
    <div>
      <h2 className='mb-4 text-2xl font-bold text-text-default'>
        История заказов
      </h2>
      {renderContent()}
    </div>
  );
});
