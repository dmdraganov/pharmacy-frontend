import { memo } from 'react';
import { getPharmacies } from '@/shared/api';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Input from '@/shared/ui/Input';
import Spinner from '@/shared/ui/Spinner';
import TabButton from '@/shared/ui/TabButton';
import RadioInput from '@/shared/ui/RadioInput';
import type { Pharmacy } from '@/entities/pharmacy';

interface Address {
  city: string;
  street: string;
  house: string;
  apartment: string;
}

const CourierForm = ({
  address,
  onAddressChange,
}: {
  address: Address;
  onAddressChange: (field: keyof Address, value: string) => void;
}) => (
  <div className='flex flex-col gap-4'>
    <Input
      name='city'
      placeholder='Город'
      value={address.city}
      onChange={(e) => onAddressChange('city', e.target.value)}
    />
    <Input
      name='street'
      placeholder='Улица'
      value={address.street}
      onChange={(e) => onAddressChange('street', e.target.value)}
    />
    <div className='grid grid-cols-2 gap-4'>
      <Input
        name='house'
        placeholder='Дом'
        value={address.house}
        onChange={(e) => onAddressChange('house', e.target.value)}
      />
      <Input
        name='apartment'
        placeholder='Квартира'
        value={address.apartment}
        onChange={(e) => onAddressChange('apartment', e.target.value)}
      />
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

interface CheckoutDeliveryProps {
  deliveryMethod: 'courier' | 'pickup';
  setDeliveryMethod: (method: 'courier' | 'pickup') => void;
  address: Address;
  setAddress: (address: Address) => void;
  selectedPharmacy: string | null;
  setSelectedPharmacy: (id: string | null) => void;
}

export const CheckoutDelivery = memo(
  ({
    deliveryMethod,
    setDeliveryMethod,
    address,
    setAddress,
    selectedPharmacy,
    setSelectedPharmacy,
  }: CheckoutDeliveryProps) => {
    const {
      data: pharmacies,
      isLoading,
      error,
    } = useDataFetching(getPharmacies, {
      skip: deliveryMethod !== 'pickup',
    });

    const handleAddressChange = (field: keyof Address, value: string) => {
      setAddress({ ...address, [field]: value });
    };

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

        {deliveryMethod === 'courier' && (
          <CourierForm
            address={address}
            onAddressChange={handleAddressChange}
          />
        )}
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
  },
);
