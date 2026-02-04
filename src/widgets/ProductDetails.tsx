import { memo, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/entities/product';
import { getProductImage } from '@/shared/lib/getProductImage';
import { useCart } from '@/features/cart';
import { FavoriteButton } from '@/features/favorites/ui/FavoriteButton';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = memo(({ product }: ProductDetailsProps) => {
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const quantityInCart = getQuantityInCart(product.id);

  useEffect(() => {
    getProductImage(product.image).then(setImageUrl);
  }, [product.image]);

  const handleAddProduct = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  const handleIncrement = useCallback(() => {
    updateQuantity(product.id, quantityInCart + 1);
  }, [quantityInCart, product.id, updateQuantity]);

  const handleDecrement = useCallback(() => {
    const newQuantity = quantityInCart - 1;
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  }, [quantityInCart, product.id, removeFromCart, updateQuantity]);

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
        <div className='flex items-start gap-4'>
          <h1 className='mb-2 text-3xl font-bold'>{product.name}</h1>
          <FavoriteButton productId={product.id} className='shrink-0 mt-2' />
        </div>
        <p className='mb-4 text-lg text-text-muted'>{product.brand}</p>
        {product.isPrescription && (
          <Badge variant='warning' className='mb-4'>
            Рецептурный
          </Badge>
        )}
        <div className='mb-6'>
          <span className='text-4xl font-bold'>{product.price} ₽</span>
          {product.oldPrice && (
            <span className='ml-3 text-xl text-text-muted line-through'>
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
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
              <Button as={Link} to='/cart' variant='primary'>
                К корзине
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
