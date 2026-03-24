import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderHistoryItem, type Order } from '@/entities/order';
import Spinner from '@/shared/ui/Spinner';
import { useCartStore } from '@/features/cart';
import { RepeatOrderButton } from '@/features/repeat-order';

interface OrderHistoryProps {
  orders?: Order[];
  isLoading?: boolean;
  error?: Error | null;
}

export const OrderHistory = memo(
  ({ orders = [], isLoading, error }: OrderHistoryProps) => {
    const addItemsToCart = useCartStore((state) => state.addItemsToCart);
    const navigate = useNavigate();

    const handleRepeatOrder = (order: Order) => {
      const itemsToCart = order.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));
      addItemsToCart(itemsToCart);
      navigate('/cart');
    };

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

      if (orders.length === 0) {
        return (
          <p className='text-text-default'>
            Здесь будет список ваших прошлых заказов.
          </p>
        );
      }

      return (
        <div className='flex flex-col gap-4'>
          {orders.map((order) => (
            <OrderHistoryItem
              key={order.id}
              order={order}
              repeatAction={
                (order.status === 'completed' ||
                  order.status === 'cancelled' ||
                  order.status === 'delivered') && (
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
  },
);
