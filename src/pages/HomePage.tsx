import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/entities/product/';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import ProductSlider from '@/widgets/ProductSlider';
import useMediaQuery from '@/shared/hooks/useMediaQuery';

const HomePage = memo(() => {
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const popularProducts = useMemo(
    () => products.filter((p) => p.isPopular),
    []
  );
  const promotionalProducts = useMemo(
    () => products.filter((p) => p.oldPrice).slice(0, isMobile ? 4 : 8),
    [isMobile]
  );

  const renderProductList = (
    productList: typeof popularProducts,
    keyPrefix: string
  ) => {
    const productCardList = productList.map((product) => (
      <ProductCard
        key={`${keyPrefix}-${product.id}`}
        product={product}
        quantityInCart={getQuantityInCart(product.id)}
        isFavorite={isFavorite(product.id)}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onToggleFavorite={toggleFavorite}
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

  return (
    <>
      <section className='mb-12'>
        <h2 className='mb-6 text-3xl font-bold text-text-heading'>
          Популярные товары
        </h2>
        {renderProductList(popularProducts, 'popular')}
      </section>

      {promotionalProducts.length > 0 && (
        <section>
          <h2 className='mb-6 text-3xl font-bold text-text-heading'>
            Акции и скидки
          </h2>
          {renderProductList(promotionalProducts, 'promo')}
        </section>
      )}
    </>
  );
});

export default HomePage;
