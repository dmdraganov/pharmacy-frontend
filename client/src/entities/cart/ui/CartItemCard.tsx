import { memo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '@/entities/cart';
import QuantityControl from '@/shared/ui/QuantityControl';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Badge from '@/shared/ui/Badge';
import { getProductImage } from '@/entities/product';

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  favoriteAction?: ReactNode;
}

const CartItemCard = memo((props: CartItemCardProps) => {
  const {
    item,
    isSelected,
    onSelectItem,
    onUpdateQuantity,
    onRemoveFromCart,
    favoriteAction,
  } = props;

  const imageUrl = getProductImage(item.image);

  return (
    <div className='flex min-w-0 flex-col gap-4 rounded border border-border-default p-3 sm:flex-row sm:items-stretch sm:p-4'>
      <div className='flex items-center sm:mr-4'>
        <Checkbox
          id={`select-${item.id}`}
          label=''
          checked={isSelected}
          onChange={() => onSelectItem(item.id)}
        />
      </div>

      <div className='flex min-w-0 flex-1 gap-3 sm:gap-4'>
        <img
          src={imageUrl}
          alt={item.name}
          className='h-20 w-20 shrink-0 object-cover sm:h-24 sm:w-24'
        />

        <div className='flex min-w-0 flex-grow flex-col'>
          <div>
            <Link
              to={`/product/${item.id}`}
              className='break-words text-base font-bold hover:underline sm:text-lg'
            >
              {item.name}
            </Link>
            <p className='text-sm text-text-muted'>{item.brand}</p>
            {item.isPrescription && (
              <Badge variant='warning' className='mt-2'>
                Рецептурный
              </Badge>
            )}
          </div>
          <div className='mt-auto flex flex-wrap items-center gap-3 pt-2'>
            {favoriteAction}
            <Button
              variant='danger'
              size='small'
              onClick={() => onRemoveFromCart(item.id)}
            >
              Удалить
            </Button>
          </div>
        </div>
      </div>
      <div className='flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end'>
        <div className='flex min-w-24 flex-col items-end'>
          <p className='text-lg font-bold'>{item.price * item.quantity} ₽</p>
          {item.oldPrice && (
            <p className='text-sm text-text-muted line-through'>
              {item.oldPrice * item.quantity} ₽
            </p>
          )}
        </div>
        <QuantityControl
          quantity={item.quantity}
          onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
        />
      </div>
    </div>
  );
});

export default CartItemCard;
