import { memo } from 'react';
import type { ProductCharacteristic } from '@/entities/product/model';

export const ProductCharacteristics = memo(
  ({ characteristics }: { characteristics: ProductCharacteristic[] }) => (
    <div className='mb-6'>
      <h2 className='mb-2 text-2xl font-bold'>Характеристики</h2>
      <ul className='divide-y divide-gray-200'>
        {characteristics.map((char, index) => (
          <li key={index} className='flex justify-between py-2'>
            <span className='font-medium text-gray-600'>{char.label}</span>
            <span className='text-gray-800'>{char.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
);
