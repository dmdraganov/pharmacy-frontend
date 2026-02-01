import { memo, useState } from 'react';
import { pharmacies } from '@/data/pharmacies';
import Input from '@/shared/ui/Input';

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
    className={`flex-1 rounded-md px-4 py-2 text-center font-medium transition-colors ${
      isActive
        ? 'bg-blue-500 text-white shadow'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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

const PickupSelector = () => (
  <div className='flex flex-col gap-3'>
    {pharmacies.map((pharmacy) => (
      <label
        key={pharmacy.id}
        className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50'
      >
        <input
          type='radio'
          name='pickupPoint'
          value={pharmacy.id}
          className='mt-1'
        />
        <div>
          <p className='font-semibold'>{pharmacy.name}</p>
          <p className='text-sm text-gray-600'>{pharmacy.address}</p>
          <p className='text-sm text-gray-500'>{pharmacy.workingHours}</p>
        </div>
      </label>
    ))}
  </div>
);

export const CheckoutDelivery = memo(() => {
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  );

  return (
    <div className='rounded-lg border bg-white p-6 shadow-sm'>
      <h2 className='mb-4 text-xl font-bold'>Способ получения</h2>

      <div className='mb-6 flex gap-2 rounded-lg bg-gray-200 p-1'>
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

      {deliveryMethod === 'courier' ? <CourierForm /> : <PickupSelector />}
    </div>
  );
});
