import { memo } from 'react';
import type { ProductCharacteristic } from '@/entities/product';

export const ProductCharacteristics = memo(
  ({ characteristics }: { characteristics: ProductCharacteristic[] }) => (
    <div className='mb-6'>
      <h2 className='mb-2 text-2xl font-bold text-text-heading'>
        Характеристики
      </h2>
      <ul className='divide-y divide-border-default'>
        {characteristics.map((char, index) => (
          <li key={index} className='flex justify-between py-2'>
            <span className='font-medium text-text-muted'>{char.label}</span>
            <span className='text-text-default'>{char.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
);
