import { memo, useState } from 'react';

type PaymentMethod = 'card' | 'sbp' | 'cash';

const paymentOptions: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'card', label: 'Картой онлайн' },
  { id: 'sbp', label: 'Система быстрых платежей (СБП)' },
  { id: 'cash', label: 'Наличными при получении' },
];

export const CheckoutPayment = memo(() => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  return (
    <div className='rounded-lg border bg-white p-6 shadow-sm'>
      <h2 className='mb-4 text-xl font-bold'>Способ оплаты</h2>
      <div className='flex flex-col gap-3'>
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50'
          >
            <input
              type='radio'
              name='paymentMethod'
              value={option.id}
              checked={paymentMethod === option.id}
              onChange={() => setPaymentMethod(option.id)}
              className='mt-1'
            />
            <span className='font-semibold'>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
});
