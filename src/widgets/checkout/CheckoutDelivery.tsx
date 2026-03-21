import { memo, useState } from 'react';
import { getPharmacies } from '@/shared/api';
import type { Pharmacy } from '@/entities/pharmacy';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Input from '@/shared/ui/Input';
import Spinner from '@/shared/ui/Spinner';

const TabButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <button
    type='button'
    onClick={onClick}
    className={`flex-1 cursor-pointer rounded-md px-4 py-2 text-center font-medium transition-colors ${
      isActive
        ? 'bg-primary text-text-inverse shadow'
        : 'bg-background-muted text-text-default hover:bg-background-muted-hover'
    }`}
  >
    {children}
  </button>
);

const CourierForm = () => (
  <div className='flex flex-col gap-4'>
    <Input name='street' placeholder='Улица' />
    <div className='grid grid-cols-3 gap-4'>
      <Input name='house' placeholder='Дом' />
      <Input name='apartment' placeholder='Квартира' />
      <Input name='postalCode' placeholder='Индекс' />
    </div>
  </div>
);

const PickupSelector = ({
  pharmacies,
  error,
}: {
  pharmacies: Pharmacy[] | null;
  error: Error | null;
}) => {
  if (error) {
    return (
      <p className='text-center text-danger'>Не удалось загрузить пункты.</p>
    );
  }
  return (
    <div className='flex flex-col gap-3'>
      {(pharmacies || []).map((pharmacy) => (
        <label
          key={pharmacy.id}
          className='flex cursor-pointer items-start gap-3 rounded-lg border border-border-default p-3 has-[:checked]:border-primary has-[:checked]:bg-primary-ultrasubtle'
        >
          <input
            type='radio'
            name='pickupPoint'
            value={pharmacy.id}
            className='mt-1'
          />
          <div>
            <p className='font-semibold'>{pharmacy.name}</p>
            <p className='text-sm text-text-muted'>{pharmacy.address}</p>
            <p className='text-sm text-text-muted'>{pharmacy.workingHours}</p>
          </div>
        </label>
      ))}
    </div>
  );
};

export const CheckoutDelivery = memo(() => {
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  );

  const {
    data: pharmacies,
    isLoading,
    error,
  } = useDataFetching(getPharmacies, {
    skip: deliveryMethod !== 'pickup',
  });

  return (
    <div className='rounded-lg border border-border-default bg-background-default p-6'>
      <h2 className='mb-4 text-xl font-bold text-text-default'>
        Способ получения
      </h2>

      <div className='mb-6 flex gap-2 rounded-lg bg-background-muted p-1'>
        <TabButton
          onClick={() => setDeliveryMethod('courier')}
          isActive={deliveryMethod === 'courier'}
        >
          Курьерская доставка
        </TabButton>
        <TabButton
          onClick={() => setDeliveryMethod('pickup')}
          isActive={deliveryMethod === 'pickup'}
        >
          Самовывоз
        </TabButton>
      </div>

      {deliveryMethod === 'courier' && <CourierForm />}
      {deliveryMethod === 'pickup' &&
        (isLoading ? (
          <div className='flex h-48 items-center justify-center'>
            <Spinner />
          </div>
        ) : (
          <PickupSelector pharmacies={pharmacies} error={error} />
        ))}
    </div>
  );
});
