import { memo, useState, useEffect } from 'react';
import { useCart } from '@/features/cart';
import type { CartItem } from '@/entities/cart';
import { Link } from 'react-router-dom';
import QuantityControl from '@/shared/ui/QuantityControl';
import Button from '@/shared/ui/Button';
import { getProductImage } from '@/shared/lib/getProductImage';

// Sub-component to handle async image loading for each item
const CheckoutItem = memo(({ item }: { item: CartItem }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getProductImage(item.image).then(setImageUrl);
  }, [item.image]);

  return (
    <div className='flex items-start gap-4 pt-4'>
      <img
        src={imageUrl ?? undefined}
        alt={item.name}
        className='h-16 w-16 rounded object-cover'
      />
      <div className='flex-grow'>
        <p className='font-semibold'>{item.name}</p>
        <p className='text-sm text-text-muted'>{item.price} ₽</p>
      </div>
      <div className='flex flex-col items-end gap-2'>
        <QuantityControl
          quantity={item.quantity}
          onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
        />
        <Button
          variant='danger'
          size='small'
          onClick={() => removeFromCart(item.id)}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
});

export const CheckoutOrderSummary = memo(() => {
  const { cartItems, totalItems, selectedItemsTotal } = useCart();

  const items = Object.values(cartItems);

  if (items.length === 0) {
    return (
      <div className='rounded-lg border border-border-default bg-background-default p-6'>
        <h2 className='mb-4 text-xl font-bold text-text-heading'>Ваш заказ</h2>
        <p>Ваша корзина пуста.</p>
        <Button as={Link} to='/' className='mt-4 w-full'>
          Вернуться к покупкам
        </Button>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-border-default bg-background-default p-6'>
      <h2 className='mb-4 text-xl font-bold text-text-heading'>Ваш заказ</h2>
      <div className='flex flex-col gap-4 divide-y divide-border-default'>
        {items.map((item) => (
          <CheckoutItem key={item.id} item={item} />
        ))}
      </div>
      <div className='mt-6 border-t border-border-default pt-4'>
        <div className='flex justify-between'>
          <span>Товары ({totalItems} шт.)</span>
          <span>{selectedItemsTotal} ₽</span>
        </div>
        <div className='mt-4 flex justify-between font-bold'>
          <span>Итого</span>
          <span>{selectedItemsTotal} ₽</span>
        </div>
      </div>
    </div>
  );
});
