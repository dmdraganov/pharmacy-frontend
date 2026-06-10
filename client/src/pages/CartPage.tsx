import { memo } from 'react';
import {
  useCartItems,
  useCartStore,
  useCartTotals,
  useSelectedItemIds,
} from '@/features/cart';
import Checkbox from '@/shared/ui/Checkbox';
import CartItemCard from '@/entities/cart/ui/CartItemCard';
import CartSummary from '@/widgets/cart/CartSummary';
import EmptyState from '@/shared/ui/EmptyState';
import Button from '@/shared/ui/Button';
import type { CartItem } from '@/entities/cart';

const CartPage = memo(() => {
  const cartItems = useCartItems();
  const selectedItemIds = useSelectedItemIds();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleSelectItem = useCartStore((state) => state.toggleSelectItem);
  const toggleSelectAll = useCartStore((state) => state.toggleSelectAll);
  const summaryProps = useCartTotals();

  const cartItemValues = Object.values(cartItems) as CartItem[];
  const areAllSelected =
    selectedItemIds.length === cartItemValues.length &&
    cartItemValues.length > 0;

  if (cartItemValues.length === 0) {
    return (
      <div className='flex grow items-center justify-center'>
        <EmptyState
          title='Корзина пуста'
          description='Добавьте товары, чтобы совершить покупку.'
          buttonText='Перейти к покупкам'
          linkTo='/'
        />
      </div>
    );
  }

  return (
    <>
      <h1 className='mb-6 text-2xl font-bold text-text-default'>Корзина</h1>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='mb-6 flex items-center justify-between rounded'>
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
                onSelectItem={toggleSelectItem}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
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
