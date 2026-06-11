import { memo } from 'react';
import {
  useCartItemById,
  useCartItemIds,
  useIsCartItemSelected,
  useCartStore,
  useCartTotals,
  useSelectedItemsCount,
} from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import Checkbox from '@/shared/ui/Checkbox';
import CartItemCard from '@/entities/cart/ui/CartItemCard';
import CartSummary from '@/widgets/cart/CartSummary';
import EmptyState from '@/shared/ui/EmptyState';
import Button from '@/shared/ui/Button';
import { FavoriteButton } from '@/features/favorites';

const CartPageItem = memo(({ productId }: { productId: string }) => {
  const item = useCartItemById(productId);
  const isSelected = useIsCartItemSelected(productId);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const toggleSelectItem = useCartStore((state) => state.toggleSelectItem);
  const isAuthenticated = useAuthStore((state) => Boolean(state.user));

  if (!item) {
    return null;
  }

  return (
    <CartItemCard
      item={item}
      isSelected={isSelected}
      onSelectItem={toggleSelectItem}
      onUpdateQuantity={updateQuantity}
      onRemoveFromCart={removeFromCart}
      favoriteAction={
        <FavoriteButton productId={item.id} isAuthenticated={isAuthenticated} />
      }
    />
  );
});

const CartPage = memo(() => {
  const cartItemIds = useCartItemIds();
  const selectedItemsCount = useSelectedItemsCount();
  const clearCart = useCartStore((state) => state.clearCart);
  const toggleSelectAll = useCartStore((state) => state.toggleSelectAll);
  const summaryProps = useCartTotals();

  const areAllSelected =
    selectedItemsCount === cartItemIds.length && cartItemIds.length > 0;

  if (cartItemIds.length === 0) {
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
            {cartItemIds.map((productId) => (
              <CartPageItem key={productId} productId={productId} />
            ))}
          </div>
        </div>
        <CartSummary {...summaryProps} />
      </div>
    </>
  );
});

export default CartPage;
