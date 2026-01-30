import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/entities/product/ui/ProductCard';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';

const HomePage = memo(() => {
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // For demonstration, let's pick some "popular" and "promotional" products
  const popularProducts = useMemo(() => products.slice(0, 4), []);
  const promotionalProducts = useMemo(
    () => products.filter((p) => p.oldPrice).slice(0, 4),
    []
  );

  return (
    <>
      <div className='mb-8 text-center'>
        <h1 className='mb-4 text-4xl font-bold'>
          Добро пожаловать в Pharmacy!
        </h1>
        <p className='text-xl text-gray-700'>Ваше здоровье - наш приоритет.</p>
      </div>

      <section className='mb-12'>
        <h2 className='mb-6 text-3xl font-bold'>Популярные товары</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {popularProducts.map((product) => (
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
      </section>

      {promotionalProducts.length > 0 && (
        <section className='mb-12'>
          <h2 className='mb-6 text-3xl font-bold'>Акции и скидки</h2>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {promotionalProducts.map((product) => (
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
        </section>
      )}
    </>
  );
});

export default HomePage;
