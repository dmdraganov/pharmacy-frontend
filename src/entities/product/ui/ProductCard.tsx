import { memo, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';
import type { Product } from '@/entities/product';
import { getProductImage } from '@/shared/lib/getProductImage';
import { FavoriteButton } from '@/features/favorites/ui/FavoriteButton';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
}

export const ProductCard = memo((props: ProductCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    product,
    quantityInCart,
    onAddToCart,
    onUpdateQuantity,
    onRemoveFromCart,
  } = props;

  const { id, name, brand, price, oldPrice, isPrescription, image } = product;

  useEffect(() => {
    getProductImage(image).then((url) => setImageUrl(url));
  }, [image]);

  const handleIncrement = useCallback(
    () => onUpdateQuantity(id, quantityInCart + 1),
    [id, onUpdateQuantity, quantityInCart]
  );

  const handleDecrement = useCallback(() => {
    const newQuantity = quantityInCart - 1;
    if (newQuantity <= 0) {
      onRemoveFromCart(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  }, [id, onRemoveFromCart, onUpdateQuantity, quantityInCart]);

  const handleAdd = useCallback(
    () => onAddToCart(product),
    [onAddToCart, product]
  );

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-lg border border-border-default 
        bg-background-default p-4 transition-all duration-300 hover:shadow-[0_5px_30px_rgba(0,0,0,0.20)] min-h-80`}
    >
      <FavoriteButton productId={id} className='absolute top-3 right-3' />

      <Link to={`/product/${id}`} className='group flex grow flex-col'>
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
