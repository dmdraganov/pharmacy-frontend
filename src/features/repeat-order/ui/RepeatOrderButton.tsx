import { memo } from 'react';
import type { Order } from '@/entities/order';
import Button from '@/shared/ui/Button';

interface RepeatOrderButtonProps {
  order: Order;
  className?: string;
  onRepeatOrder: (order: Order) => void;
}

export const RepeatOrderButton = memo(
  ({ order, className, onRepeatOrder }: RepeatOrderButtonProps) => {
    const handleRepeatOrder = () => {
      onRepeatOrder(order);
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
