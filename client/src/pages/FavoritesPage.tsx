import { memo, useMemo } from 'react';
import { useFavoriteIds } from '@/features/favorites';
import { getProducts } from '@/shared/api';
import { ProductCardWithCart } from '@/features/cart';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import EmptyState from '@/shared/ui/EmptyState';
import Spinner from '@/shared/ui/Spinner';

const FavoritesPage = memo(() => {
  const { data: products, isLoading, error } = useDataFetching(getProducts);
  const favoriteIds = useFavoriteIds();

  const favoriteProducts = useMemo(
    () => (products || []).filter((p) => favoriteIds.includes(p.id)),
    [products, favoriteIds]
  );

  if (isLoading) {
    return (
      <div className='flex grow items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex grow items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке избранного</h2>
        <p>{error.message}</p>
      </div>
    );
  }

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
      <h1 className='mb-6 text-2xl font-bold text-text-default'>Избранное</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {favoriteProducts.map((product) => (
          <ProductCardWithCart key={product.id} product={product} />
        ))}
      </div>
    </>
  );
});

export default FavoritesPage;
