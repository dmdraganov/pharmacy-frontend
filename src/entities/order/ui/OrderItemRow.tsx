import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { OrderItem } from '@/entities/order';
import { getProductImage } from '@/entities/product';

export const OrderItemRow = memo(({ item }: { item: OrderItem }) => {
  const imageUrl = getProductImage(item.product.image);

  return (
    <div className="flex items-center gap-4 py-2">
      <img
        src={imageUrl}
        alt={item.product.name}
        className="h-16 w-16 rounded object-cover"
      />
      <div className="flex-grow">
        <Link
          to={`/product/${item.product.id}`}
          className="font-semibold text-text-default hover:text-primary hover:underline"
        >
          {item.product.name}
        </Link>
      </div>
      <div className="text-right text-text-default">
        <p>{item.quantity} шт.</p>
        <p className="font-semibold">{item.price * item.quantity} ₽</p>
      </div>
    </div>
  );
});
