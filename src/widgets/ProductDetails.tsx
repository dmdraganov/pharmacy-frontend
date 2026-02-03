import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/entities/product';
import { getProductImage } from '@/shared/lib/getProductImage';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = memo(({ product }: ProductDetailsProps) => {
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const quantityInCart = getQuantityInCart(product.id);

  useEffect(() => {
    getProductImage(product.image).then(setImageUrl);
  }, [product.image]);

  const handleAddProduct = () => {
    addToCart(product);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  const handleRemoveProduct = () => {
    removeFromCart(product.id);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
      <div>
        <img
          src={imageUrl ?? undefined}
          alt={product.name}
          className='w-full rounded-lg'
        />
      </div>
      <div>
        <h1 className='mb-2 text-3xl font-bold'>{product.name}</h1>
        <p className='mb-4 text-lg text-text-muted'>{product.brand}</p>
        {product.isPrescription && (
          <Badge variant='warning' className='mb-4'>
            Рецептурный
          </Badge>
        )}
        <div className='mb-6'>
          <span className='text-4xl font-bold'>{product.price} ₽</span>
          {product.oldPrice && (
            <span className='ml-3 text-xl text-text-subtle line-through'>
              {product.oldPrice} ₽
            </span>
          )}
        </div>
        <div className='flex flex-col gap-4'>
          {quantityInCart === 0 ? (
            <Button onClick={handleAddProduct}>Добавить в корзину</Button>
          ) : (
            <div className='flex items-center justify-between'>
              <QuantityControl
                quantity={quantityInCart}
                onIncrement={() => handleUpdateQuantity(quantityInCart + 1)}
                onDecrement={() => {
                  if (quantityInCart - 1 <= 0) {
                    handleRemoveProduct();
                  } else {
                    handleUpdateQuantity(quantityInCart - 1);
                  }
                }}
              />
              <Button as={Link} to='/cart' variant='primary'>
                К корзине
              </Button>
            </div>
          )}
          <Button onClick={handleToggleFavorite}>
            {isFavorite(product.id) ? 'В избранном' : 'В избранное'}
          </Button>
        </div>
      </div>
    </div>
  );
});
