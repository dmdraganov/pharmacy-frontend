import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '@/entities/cart';
import QuantityControl from '@/shared/ui/QuantityControl';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Badge from '@/shared/ui/Badge';
import { getProductImage } from '@/shared/lib/getProductImage';

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  isFavorite: boolean;
  onSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const CartItemCard = memo((props: CartItemCardProps) => {
  const {
    item,

    isSelected,

    isFavorite,

    onSelectItem,

    onUpdateQuantity,

    onRemoveFromCart,

    onToggleFavorite,
  } = props;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getProductImage(item.image).then(setImageUrl);
  }, [item.image]);

  return (
    <div className='flex items-stretch rounded border p-4 shadow-sm'>
      <div className='mr-4 flex items-center'>
        <Checkbox
          id={`select-${item.id}`}
          label=''
          checked={isSelected}
          onChange={() => onSelectItem(item.id)}
        />
      </div>

      <img
        src={imageUrl ?? undefined}
        alt={item.name}
        className='mr-4 h-24 w-24 object-cover'
      />

      <div className='flex flex-grow flex-col'>
        <div>
          <Link
            to={`/product/${item.id}`}
            className='text-lg font-bold hover:underline'
          >
            {' '}
            {item.name}
          </Link>
          <p className='text-sm text-text-muted'>{item.brand}</p>
          {item.isPrescription && (
            <Badge variant='warning' className='mt-2'>
              Рецептурный
            </Badge>
          )}
        </div>
        <div className='mt-auto flex items-center gap-4 pt-2'>
          <Button
            variant='secondary'
            size='small'
            onClick={() => onToggleFavorite(item.id)}
          >
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
          <Button
            variant='danger'
            size='small'
            onClick={() => onRemoveFromCart(item.id)}
          >
            Удалить
          </Button>
        </div>
      </div>
      <div className='flex flex-col items-end justify-between'>
        <div className='flex w-32 flex-col items-end'>
          <p className='text-lg font-bold'>{item.price * item.quantity} ₽</p>
          {item.oldPrice && (
            <p className='text-sm text-text-subtle line-through'>
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
