import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import CartItemCard from '@/entities/cart/ui/CartItemCard';
import CartSummary from '@/widgets/CartSummary';

const CartPage = memo(() => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    selectedItemIds,
    toggleSelectItem,
    toggleSelectAll,
    ...summaryProps
  } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const cartItemValues = Object.values(cartItems);
  const areAllSelected =
    selectedItemIds.length === cartItemValues.length &&
    cartItemValues.length > 0;

  if (cartItemValues.length === 0) {
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
          <div className='mb-6 flex items-center justify-between rounded border p-4'>
            <Checkbox
              id='select-all'
              label='Выбрать все'
              checked={areAllSelected}
              onChange={() => toggleSelectAll()}
            />
            <Button variant='secondary' onClick={clearCart}>
              Очистить корзину
            </Button>
          </div>
          <div className='space-y-4'>
            {cartItemValues.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                isSelected={selectedItemIds.includes(item.id)}
                isFavorite={isFavorite(item.id)}
                onSelectItem={toggleSelectItem}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
        <CartSummary {...summaryProps} />
      </div>
    </>
  );
});

export default CartPage;
