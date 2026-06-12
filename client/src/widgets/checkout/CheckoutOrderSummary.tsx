import { memo } from 'react';
import {
  useAllCartTotals,
  useCartItemById,
  useCartItemIds,
  useCartStore,
} from '@/features/cart';
import { Link } from 'react-router-dom';
import QuantityControl from '@/shared/ui/QuantityControl';
import Button from '@/shared/ui/Button';
import { getProductImage, handleProductImageError } from '@/entities/product';

// Sub-component to handle async image loading for each item
const CheckoutItem = memo(({ productId }: { productId: string }) => {
  const item = useCartItemById(productId);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  if (!item) {
    return null;
  }

  const imageUrl = getProductImage(item.image);

  return (
    <div className='flex min-w-0 flex-col gap-3 pt-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:gap-4'>
      <img
        src={imageUrl}
        alt={item.name}
        className='h-16 w-16 shrink-0 rounded object-cover'
        onError={handleProductImageError}
      />
      <div className='min-w-0 flex-grow'>
        <p className='break-words font-semibold'>{item.name}</p>
        <p className='text-sm text-text-muted'>{item.price} ₽</p>
      </div>
      <div className='flex flex-row items-center justify-between gap-2 min-[420px]:flex-col min-[420px]:items-end'>
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
  const cartItemIds = useCartItemIds();
  const { totalItems, total } = useAllCartTotals();

  if (cartItemIds.length === 0) {
    return (
      <div className='rounded-lg border border-border-default bg-background-default p-4 sm:p-6'>
        <h2 className='mb-4 text-xl font-bold text-text-default'>Ваш заказ</h2>
        <p>Ваша корзина пуста.</p>
        <Button as={Link} to='/' className='mt-4 w-full'>
          Вернуться к покупкам
        </Button>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-border-default bg-background-default p-4 sm:p-6'>
      <h2 className='mb-4 text-xl font-bold text-text-default'>Ваш заказ</h2>
      <div className='flex flex-col gap-4 divide-y divide-border-default'>
        {cartItemIds.map((productId) => (
          <CheckoutItem key={productId} productId={productId} />
        ))}
      </div>
      <div className='mt-6 border-t border-border-default pt-4'>
        <div className='flex justify-between gap-3'>
          <span>Товары ({totalItems} шт.)</span>
          <span>{total} ₽</span>
        </div>
        <div className='mt-4 flex justify-between gap-3 font-bold'>
          <span>Итого</span>
          <span>{total} ₽</span>
        </div>
      </div>
    </div>
  );
});
