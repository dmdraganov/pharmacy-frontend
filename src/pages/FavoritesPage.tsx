import { memo, useMemo } from 'react';
import { useFavorites } from '@/features/favorites';
import { products } from '@/data/products';
import ProductCard from '@/shared/ui/ProductCard';
import Button from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart';
import type { Product } from '@/entities/product/model'; // Assuming Product type is needed

const FavoritesPage = memo(() => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const favoriteProducts = useMemo(
    () => products.filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  const getQuantityInCart = (productId: string) => {
    return items.find((item) => item.id === productId)?.quantity || 0;
  };

  const handleAddProduct = (product: Product) => {
    addToCart(product);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveProduct = (productId: string) => {
    removeFromCart(productId);
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className='text-center'>
        <h1 className='mb-4 text-2xl font-bold'>В избранном пусто</h1>
        <p className='mb-6 text-gray-600'>
          Добавляйте товары в избранное, чтобы не потерять их.
        </p>
        <Link to='/'>
          <Button>Перейти к покупкам</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className='mb-6 text-2xl font-bold'>Избранное</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            quantityInCart={getQuantityInCart(product.id)}
            isFavorite={true} // All products on this page are favorites
            onAddProduct={() => handleAddProduct(product)}
            onUpdateQuantity={(newQuantity) =>
              handleUpdateQuantity(product.id, newQuantity)
            }
            onRemoveProduct={() => handleRemoveProduct(product.id)}
            onToggleFavorite={() => toggleFavorite(product.id)}
          />
        ))}
      </div>
    </>
  );
});

export default FavoritesPage;
