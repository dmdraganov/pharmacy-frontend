import { memo, type Dispatch, type SetStateAction } from 'react';
import RadioInput from '@/shared/ui/RadioInput';
import Input from '@/shared/ui/Input';

type PaymentMethod = 'online' | 'on-receipt';
export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
}

const paymentOptions: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'online', label: 'Картой онлайн' },
  { id: 'on-receipt', label: 'Картой или наличными при получении' },
];

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

interface CreditCardFormProps {
  cardDetails: CardDetails;
  setCardDetails: Dispatch<SetStateAction<CardDetails>>;
  errors?: Partial<Record<keyof CardDetails, string>>;
}

const CreditCardForm = memo(
  ({ cardDetails, setCardDetails, errors }: CreditCardFormProps) => (
    <div className='mt-4 flex flex-col gap-4 rounded-md border border-border-default bg-background-muted p-3 sm:p-4'>
      <Input
        name='cardNumber'
        placeholder='0000 0000 0000 0000'
        label='Номер карты'
        value={cardDetails.number}
        onChange={(event) =>
          setCardDetails((current) => ({
            ...current,
            number: formatCardNumber(event.target.value),
          }))
        }
        inputMode='numeric'
        autoComplete='cc-number'
        error={errors?.number}
      />
      <Input
        name='expiryDate'
        placeholder='ММ/ГГ'
        label='Срок действия'
        value={cardDetails.expiry}
        onChange={(event) =>
          setCardDetails((current) => ({
            ...current,
            expiry: formatExpiry(event.target.value),
          }))
        }
        inputMode='numeric'
        autoComplete='cc-exp'
        error={errors?.expiry}
      />
      <Input
        name='cvc'
        placeholder='CVC'
        label='CVC'
        value={cardDetails.cvv}
        onChange={(event) =>
          setCardDetails((current) => ({
            ...current,
            cvv: event.target.value.replace(/\D/g, '').slice(0, 4),
          }))
        }
        inputMode='numeric'
        autoComplete='cc-csc'
        error={errors?.cvv}
      />
    </div>
  )
);

interface CheckoutPaymentProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cardDetails: CardDetails;
  setCardDetails: Dispatch<SetStateAction<CardDetails>>;
  errors?: Partial<Record<keyof CardDetails, string>>;
}

export const CheckoutPayment = memo(
  ({
    paymentMethod,
    setPaymentMethod,
    cardDetails,
    setCardDetails,
    errors,
  }: CheckoutPaymentProps) => {
    return (
      <div className='rounded-lg border border-border-default bg-background-default p-4 sm:p-6'>
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
                <CreditCardForm
                  cardDetails={cardDetails}
                  setCardDetails={setCardDetails}
                  errors={errors}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
