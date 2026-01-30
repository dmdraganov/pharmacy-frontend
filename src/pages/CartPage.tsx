import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart';
import QuantityControl from '@/shared/ui/QuantityControl';
import Button from '@/shared/ui/Button';

const CartPage = memo(() => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useCart();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  if (Object.values(cartItems).length === 0) {
    return (
      <div className='text-center'>
        <h1 className='mb-4 text-2xl font-bold'>Корзина пуста</h1>
        <p className='mb-6 text-gray-600'>
          Добавьте товары, чтобы совершить покупку.
        </p>
        <Link to='/'>
          <Button>Перейти к покупкам</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className='mb-6 text-2xl font-bold'>Корзина</h1>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='space-y-4'>
            {Object.values(cartItems).map((item) => (
              <div
                key={item.id}
                className='flex items-center rounded border p-4 shadow-sm'
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className='mr-4 h-16 w-16 object-cover'
                />
                <div className='flex-grow'>
                  <Link
                    to={`/product/${item.id}`}
                    className='text-lg font-bold hover:underline'
                  >
                    {item.name}
                  </Link>
                  <p className='text-gray-600'>{item.brand}</p>
                  <p className='text-lg font-bold'>{item.price} ₽</p>
                </div>
                <div className='flex items-center space-x-4'>
                  <QuantityControl
                    quantity={item.quantity}
                    onIncrement={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    onDecrement={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                  />
                  <Button
                    variant='danger'
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-6 flex justify-between'>
            <Button variant='secondary' onClick={clearCart}>
              Очистить корзину
            </Button>
            <Link to='/delivery'>
              <Button>Оформить заказ</Button>
            </Link>
          </div>
        </div>
        <div className='rounded border p-4 shadow-sm lg:col-span-1'>
          <h2 className='mb-4 text-xl font-bold'>Итого</h2>
          <div className='flex justify-between text-lg'>
            <span>Товары ({Object.values(cartItems).length})</span>
            <span>{cartTotal} ₽</span>
          </div>
          <Button className='mt-4 w-full'>Перейти к оформлению</Button>
        </div>
      </div>
    </>
  );
});

export default CartPage;
