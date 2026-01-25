import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/shared/ui/ProductCard';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';

const HomePage = memo(() => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // For demonstration, let's pick some "popular" and "promotional" products
  const popularProducts = useMemo(() => products.slice(0, 4), []);
  const promotionalProducts = useMemo(
    () => products.filter((p) => p.oldPrice).slice(0, 4),
    []
  );

  const getQuantityInCart = (productId: string) => {
    return items.find((item) => item.id === productId)?.quantity || 0;
  };

  const handleAddProduct = (product: typeof products[0]) => {
    addToCart(product);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveProduct = (productId: string) => {
    removeFromCart(productId);
  };

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
              {...product}
              quantityInCart={getQuantityInCart(product.id)}
              isFavorite={isFavorite(product.id)}
              onAddProduct={() => handleAddProduct(product)}
              onUpdateQuantity={(newQuantity) =>
                handleUpdateQuantity(product.id, newQuantity)
              }
              onRemoveProduct={() => handleRemoveProduct(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
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
                {...product}
                quantityInCart={getQuantityInCart(product.id)}
                isFavorite={isFavorite(product.id)}
                onAddProduct={() => handleAddProduct(product)}
                onUpdateQuantity={(newQuantity) =>
                  handleUpdateQuantity(product.id, newQuantity)
                }
                onRemoveProduct={() => handleRemoveProduct(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
});

export default HomePage;
