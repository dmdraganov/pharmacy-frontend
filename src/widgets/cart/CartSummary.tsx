import { memo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/shared/ui/Button';

interface CartSummaryProps {
  selectedItemsCount: number;
  selectedItemsTotal: number;
  selectedItemsOriginalTotal: number;
  selectedItemsDiscount: number;
}

const CartSummary = memo((props: CartSummaryProps) => {
  const {
    selectedItemsCount,
    selectedItemsTotal,
    selectedItemsOriginalTotal,
    selectedItemsDiscount,
  } = props;

  return (
    <div className='relative z-10 h-fit rounded border border-border-default bg-background-default p-4 lg:col-span-1 overflow-hidden'>
      <h2 className='mb-6 text-xl font-bold text-text-heading'>Ваша корзина</h2>
      <div className='flex flex-col gap-2'>
        {selectedItemsDiscount > 0 ? (
          <>
            <div className='flex justify-between text-lg'>
              <span>Товары {selectedItemsCount} шт.</span>
              <span className='line-through'>
                {selectedItemsOriginalTotal} ₽
              </span>
            </div>
            <div className='flex justify-between text-lg text-success'>
              <span>Скидка</span>
              <span>{selectedItemsDiscount} ₽</span>
            </div>
          </>
        ) : (
          <div className='flex justify-between text-lg'>
            <span>Товары {selectedItemsCount} шт.</span>
            <span>{selectedItemsTotal} ₽</span>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-4 mt-8'>
        <div className='flex justify-between text-xl font-bold'>
          <span>К оплате</span>
          <span>{selectedItemsTotal} ₽</span>
        </div>
        <Button as={Link} to='/checkout'>
          Перейти к оформлению
        </Button>
      </div>
    </div>
  );
});

export default CartSummary;
