import { memo, useState } from 'react';
import { getPharmacies } from '@/shared/api';
import type { Pharmacy } from '@/entities/pharmacy';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Input from '@/shared/ui/Input';
import Spinner from '@/shared/ui/Spinner';
import RadioInput from '@/shared/ui/RadioInput';
import TabButton from '@/shared/ui/TabButton';

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
  selectedId,
  onSelect,
}: {
  pharmacies: Pharmacy[] | null;
  error: Error | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) => {
  if (error) {
    return (
      <p className='text-center text-danger'>Не удалось загрузить пункты.</p>
    );
  }
  return (
    <div className='flex flex-col gap-3'>
      {(pharmacies || []).map((pharmacy) => (
        <RadioInput
          key={pharmacy.id}
          name='pickupPoint'
          value={pharmacy.id}
          checked={selectedId === pharmacy.id}
          onChange={onSelect}
        >
          <div>
            <p className='font-semibold'>{pharmacy.name}</p>
            <p className='text-sm text-text-muted'>{pharmacy.address}</p>
            <p className='text-sm text-text-muted'>{pharmacy.workingHours}</p>
          </div>
        </RadioInput>
      ))}
    </div>
  );
};

export const CheckoutDelivery = memo(() => {
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

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
          <PickupSelector
            pharmacies={pharmacies}
            error={error}
            selectedId={selectedPharmacy}
            onSelect={setSelectedPharmacy}
          />
        ))}
    </div>
  );
});
