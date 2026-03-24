import { memo } from 'react';
import RadioInput from '@/shared/ui/RadioInput';

type PaymentMethod = 'online' | 'on-receipt';

const paymentOptions: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'online', label: 'Картой онлайн' },
  { id: 'on-receipt', label: 'Картой или наличными при получении' },
];

interface CheckoutPaymentProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export const CheckoutPayment = memo(
  ({ paymentMethod, setPaymentMethod }: CheckoutPaymentProps) => {
    return (
      <div className='rounded-lg border border-border-default bg-background-default p-6'>
        <h2 className='mb-4 text-xl font-bold text-text-default'>
          Способ оплаты
        </h2>
        <div className='flex flex-col gap-3'>
          {paymentOptions.map((option) => (
            <RadioInput
              key={option.id}
              name='paymentMethod'
              value={option.id}
              checked={paymentMethod === option.id}
              onChange={(val) => setPaymentMethod(val as PaymentMethod)}
            >
              <span className='font-semibold'>{option.label}</span>
            </RadioInput>
          ))}
        </div>
      </div>
    );
  },
);
