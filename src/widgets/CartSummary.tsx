import { memo } from 'react';
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
    <div className='h-fit rounded border p-4 shadow-sm lg:col-span-1'>
      <h2 className='mb-4 text-xl font-bold'>Ваша корзина</h2>
      <div className='space-y-2'>
        {selectedItemsDiscount > 0 ? (
          <>
            <div className='flex justify-between text-lg'>
              <span>Товары {selectedItemsCount} шт.</span>
              <span className='line-through'>
                {selectedItemsOriginalTotal} ₽
              </span>
            </div>
            <div className='flex justify-between text-lg text-green-600'>
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
        <div className='flex justify-between text-xl font-bold'>
          <span>К оплате</span>
          <span>{selectedItemsTotal} ₽</span>
        </div>
      </div>
      <Button className='mt-4 w-full'>Перейти к оформлению</Button>
    </div>
  );
});

export default CartSummary;
