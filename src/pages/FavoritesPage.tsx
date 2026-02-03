import { memo, useMemo } from 'react';
import { useFavorites } from '@/features/favorites';
import { products } from '@/data/products';
import { ProductCard } from '@/entities/product/';
import { useCart } from '@/features/cart';
import EmptyState from '@/shared/ui/EmptyState';

const FavoritesPage = memo(() => {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();

  const favoriteProducts = useMemo(
    () => products.filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  if (favoriteProducts.length === 0) {
    return (
      <div className='flex grow items-center justify-center'>
        <EmptyState
          title='В избранном пусто'
          description='Добавляйте товары в избранное, чтобы не потерять их.'
          buttonText='Перейти к покупкам'
          linkTo='/'
        />
      </div>
    );
  }

  return (
    <>
      <h1 className='mb-6 text-2xl font-bold text-text-heading'>Избранное</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantityInCart={getQuantityInCart(product.id)}
            isFavorite={isFavorite(product.id)}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </>
  );
});

export default FavoritesPage;
