import { memo } from 'react';
import { useCart } from '@/features/cart';
import Button from '@/shared/ui/Button';

interface CheckoutActionsProps {
  onConfirm: () => void;
  isProcessing: boolean;
}

export const CheckoutActions = memo(
  ({ onConfirm, isProcessing }: CheckoutActionsProps) => {
    const { selectedItemsTotal } = useCart();
    return (
      <div className='rounded-lg border border-border-default bg-background-default p-6'>
        <div className='mb-4 flex justify-between font-bold'>
          <span>Итого к оплате</span>
          <span>{selectedItemsTotal} ₽</span>
        </div>
        <p className='mb-4 text-xs text-text-muted'>
          Нажимая кнопку «Подтвердить заказ», вы соглашаетесь с условиями
          продажи. После подтверждения заказ нельзя будет изменить.
        </p>
        <Button
          className='w-full py-3 text-lg'
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? 'Оформляем...' : 'Подтвердить заказ'}
        </Button>
      </div>
    );
  }
);
