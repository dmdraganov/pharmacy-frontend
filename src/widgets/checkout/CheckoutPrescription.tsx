import { memo, useMemo } from 'react';
import { useCart } from '@/features/cart';

export const CheckoutPrescription = memo(() => {
  const { cartItems } = useCart();

  const needsPrescription = useMemo(() => {
    return Object.values(cartItems).some((item) => item.isPrescription);
  }, [cartItems]);

  if (!needsPrescription) {
    return null;
  }

  return (
    <div className='rounded-lg border border-warning-border bg-warning-subtle p-6'>
      <h2 className='mb-4 text-xl font-bold text-text-heading'>
        Загрузка рецепта
      </h2>
      <p className='mb-4 text-sm text-warning-text'>
        Один или несколько товаров в вашем заказе требуют рецепта. Пожалуйста,
        загрузите скан или фотографию вашего рецепта. Оригинал потребуется
        предъявить при получении.
      </p>
      <div className='flex flex-col gap-4'>
        <label
          htmlFor='prescription-upload'
          className='flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-default bg-background-default p-6'
        >
          <span>Нажмите, чтобы загрузить файл</span>
          <span className='text-xs text-text-muted'>PNG, JPG или PDF</span>
          <input id='prescription-upload' type='file' className='sr-only' />
        </label>
        <label className='flex items-start gap-2'>
          <input type='checkbox' name='prescriptionConsent' className='mt-1' />
          <span className='text-sm text-text-default'>
            Я подтверждаю, что у меня есть действующий рецепт на данный
            препарат, и я предъявлю его при получении заказа.
          </span>
        </label>
      </div>
    </div>
  );
});
