import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';
import type { Product } from '@/entities/product';
import { getProductImage } from '@/shared/lib/getProductImage';

import HeartIcon from '@/shared/ui/HeartIcon';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
}

export const ProductCard = memo((props: ProductCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    product,
    isFavorite,
    quantityInCart,
    onAddToCart,
    onUpdateQuantity,
    onRemoveFromCart,
    onToggleFavorite,
  } = props;

  const { id, name, brand, price, oldPrice, isPrescription, image } = product;

  useEffect(() => {
    getProductImage(image).then((url) => setImageUrl(url));
  }, [image]);

  const handleIncrement = () => onUpdateQuantity(id, quantityInCart + 1);
  const handleDecrement = () => {
    const newQuantity = quantityInCart - 1;
    if (newQuantity <= 0) {
      onRemoveFromCart(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };
  const handleAdd = () => onAddToCart(product);
  const handleToggleFavorite = () => onToggleFavorite(id);

  return (
    <div className='relative flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-background-default p-4 transition-all duration-300 hover:shadow-xl min-h-[320px]'>
      <button
        onClick={handleToggleFavorite}
        className='absolute top-3 right-3 z-10'
      >
        <HeartIcon
          className={`h-6 w-6 transition-colors ${
            isFavorite ? 'text-danger' : 'text-border-default hover:text-danger'
          }`}
        />
      </button>
      <Link
        to={`/product/${id}`}
        className='group block flex flex-grow flex-col'
      >
        <img
          className='w-full aspect-square object-cover transition-transform duration-300'
          src={imageUrl ?? undefined}
          alt={name}
          loading='lazy'
        />
        <div className='py-4'>
          <div className='mb-2 text-xl font-semibold line-clamp-2' title={name}>
            {name}
          </div>
          <p className='text-base text-text-muted'>{brand}</p>
        </div>
      </Link>
      <div className='mt-auto pt-2'>
        <div className='mb-4'>
          <span className='text-xl font-semibold'>{price} ₽</span>
          {oldPrice && (
            <span className='ml-2 text-sm text-text-subtle line-through'>
              {oldPrice} ₽
            </span>
          )}
          {isPrescription && <Badge variant='warning'>Рецептурный</Badge>}
        </div>
        <div className='flex flex-col gap-2'>
          {!quantityInCart ? (
            <Button onClick={handleAdd}>Добавить в корзину</Button>
          ) : (
            <div className='flex items-center justify-between gap-3'>
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
