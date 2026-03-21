import { memo, useMemo } from 'react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product/';
import { useCart } from '@/features/cart';
import { getProducts } from '@/shared/api';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import useMediaQuery from '@/shared/hooks/useMediaQuery';
import Spinner from '@/shared/ui/Spinner';
import ProductSlider from '@/widgets/product/ProductSlider';

const HomePage = memo(() => {
  const { data: products, isLoading, error } = useDataFetching(getProducts);
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const popularProducts = useMemo(
    () => (products || []).filter((p) => p.isPopular),
    [products]
  );
  const promotionalProducts = useMemo(
    () => (products || []).filter((p) => p.oldPrice).slice(0, isMobile ? 4 : 8),
    [products, isMobile]
  );

  const renderProductList = (productList: Product[], keyPrefix: string) => {
    const productCardList = productList.map((product) => (
      <ProductCard
        key={`${keyPrefix}-${product.id}`}
        product={product}
        quantityInCart={getQuantityInCart(product.id)}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
      />
    ));

    if (isMobile) {
      return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {productCardList}
        </div>
      );
    }

    return <ProductSlider>{productCardList}</ProductSlider>;
  };

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке данных</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <section className='mb-12'>
        <h2 className='mb-6 text-3xl font-bold text-text-default'>
          Популярные товары
        </h2>
        {renderProductList(popularProducts, 'popular')}
      </section>

      {promotionalProducts.length > 0 && (
        <section>
          <h2 className='mb-6 text-3xl font-bold text-text-default'>
            Акции и скидки
          </h2>
          {renderProductList(promotionalProducts, 'promo')}
        </section>
      )}
    </>
  );
});

export default HomePage;
