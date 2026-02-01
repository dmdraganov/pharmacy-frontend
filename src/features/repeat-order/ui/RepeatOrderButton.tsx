import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '@/entities/order';
import { useCart } from '@/features/cart';
import Button from '@/shared/ui/Button';

interface RepeatOrderButtonProps {
  order: Order;
  className?: string;
}

export const RepeatOrderButton = memo(
  ({ order, className }: RepeatOrderButtonProps) => {
    const { addItemsToCart } = useCart();
    const navigate = useNavigate();

    const handleRepeatOrder = () => {
      addItemsToCart(order.items);
      navigate('/cart');
    };

    return (
      <Button
        variant='primary'
        className={className}
        onClick={handleRepeatOrder}
      >
        Повторить заказ
      </Button>
    );
  }
);
