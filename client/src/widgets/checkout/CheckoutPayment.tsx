import { memo } from 'react';
import RadioInput from '@/shared/ui/RadioInput';
import Input from '@/shared/ui/Input';

type PaymentMethod = 'online' | 'on-receipt';

const paymentOptions: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'online', label: 'Картой онлайн' },
  { id: 'on-receipt', label: 'Картой или наличными при получении' },
];

const CreditCardForm = () => (
  <div className='mt-4 flex flex-col gap-4 rounded-md border border-border-default bg-background-muted p-4'>
    <Input
      name='cardNumber'
      placeholder='0000 0000 0000 0000'
      label='Номер карты'
    />
    <div className='grid grid-cols-2 gap-4'>
      <Input name='expiryDate' placeholder='ММ/ГГ' label='Срок действия' />
      <Input name='cvc' placeholder='CVC' label='CVC' />
    </div>
  </div>
);

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
            <div key={option.id}>
              <RadioInput
                name='paymentMethod'
                value={option.id}
                checked={paymentMethod === option.id}
                onChange={(val) => setPaymentMethod(val as PaymentMethod)}
              >
                <span className='font-semibold'>{option.label}</span>
              </RadioInput>
              {option.id === 'online' && paymentMethod === 'online' && (
                <CreditCardForm />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
