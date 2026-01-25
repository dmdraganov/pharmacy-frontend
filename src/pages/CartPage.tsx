import { memo } from 'react';
import { useCart, type CartItem } from '@/features/cart';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import QuantityControl from '@/shared/ui/QuantityControl';

const CartItemRow = memo(
  ({
    item,
    onUpdate,
    onRemove,
  }: {
    item: CartItem;
    onUpdate: (id: string, q: number) => void;
    onRemove: (id: string) => void;
  }) => {
    const handleIncrement = () => onUpdate(item.id, item.quantity + 1);
    const handleDecrement = () => {
      if (item.quantity - 1 <= 0) {
        onRemove(item.id);
      } else {
        onUpdate(item.id, item.quantity - 1);
      }
    };

    return (
      <div className='grid grid-cols-5 items-center gap-4 border-b py-4'>
        <div className='col-span-2 flex items-center gap-4'>
          <img
            src={item.image}
            alt={item.name}
            className='h-16 w-16 rounded'
          />
          <div>
            <p className='font-semibold'>{item.name}</p>
            <p className='text-sm text-gray-500'>{item.brand}</p>
          </div>
        </div>
        <div className='text-center'>
          <QuantityControl
            quantity={item.quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </div>
        <div className='text-center font-semibold'>
          {item.price * item.quantity} ₽
        </div>
        <div className='text-center'>
          <Button onClick={() => onRemove(item.id)} variant='danger' size='small'>Удалить</Button>
        </div>
      </div>
    );
  }
);

const CartPage = memo(() => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className='text-center'>
        <h1 className='mb-4 text-2xl font-bold'>Корзина пуста</h1>
        <p className='mb-6 text-gray-600'>
          Добавьте товары из каталога, чтобы сделать заказ.
        </p>
        <Link to='/'>
          <Button>Перейти к покупкам</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Корзина</h1>
        <Button onClick={clearCart}>Очистить корзину</Button>
      </div>
      <div>
        <div className='grid grid-cols-5 gap-4 border-b pb-2 font-bold'>
          <div className='col-span-2'>Товар</div>
          <div className='text-center'>Количество</div>
          <div className='text-center'>Сумма</div>
          <div className='text-center'>Действие</div>
        </div>
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdate={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>
      <div className='mt-8 flex justify-end'>
        <div className='w-1/3 rounded-lg border p-4'>
          <h2 className='mb-4 text-xl font-bold'>Итого</h2>
          <div className='flex justify-between'>
            <span>Сумма заказа:</span>
            <span className='font-bold'>{total} ₽</span>
          </div>
          <Button className='mt-4 w-full'>Перейти к оформлению</Button>
        </div>
      </div>
    </>
  );
});

export default CartPage;
