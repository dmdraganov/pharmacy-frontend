import { memo } from 'react';
import Button from './Button';

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityControl = memo(
  ({ quantity, onIncrement, onDecrement }: QuantityControlProps) => {
    return (
      <div className='flex items-center gap-2'>
        <Button onClick={onDecrement} variant='secondary' size='small'>
          -
        </Button>
        <span className='w-8 text-center text-lg font-semibold'>
          {quantity}
        </span>
        <Button onClick={onIncrement} variant='secondary' size='small'>
          +
        </Button>
      </div>
    );
  }
);

export default QuantityControl;
