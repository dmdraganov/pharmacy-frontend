import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { OrderItem } from '@/entities/order';
import { getProductImage } from '@/shared/lib/getProductImage';

export const OrderItemRow = memo(({ item }: { item: OrderItem }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getProductImage(item.product.image).then(setImageUrl);
  }, [item.product.image]);

  return (
    <div className='flex items-center gap-4 py-2'>
      <img
        src={imageUrl ?? undefined}
        alt={item.product.name}
        className='h-16 w-16 rounded object-cover'
      />
      <div className='flex-grow'>
        <Link
          to={`/product/${item.product.id}`}
          className='font-semibold hover:underline'
        >
          {item.product.name}
        </Link>
      </div>
      <div className='text-right'>
        <p>{item.quantity} шт.</p>
        <p className='font-semibold'>{item.price * item.quantity} ₽</p>
      </div>
    </div>
  );
});
