import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';
import type { Product } from '@/entities/product';
import { getProductImage } from '@/shared/lib/getProductImage';

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
    <div className='flex h-full flex-col overflow-hidden rounded border shadow-lg'>
      <Link
        to={`/product/${id}`}
        className='group block flex flex-grow flex-col'
      >
        <img
          className='w-full transition-transform duration-300 group-hover:scale-105'
          src={imageUrl ?? undefined}
          alt={name}
          loading='lazy'
        />
        <div className='px-6 py-4'>
          <div className='mb-2 min-h-16 text-xl font-bold' title={name}>
            {name}
          </div>
          <p className='text-base text-gray-700'>{brand}</p>
        </div>
      </Link>
      <div className='mt-auto px-6 pb-4 pt-2'>
        <div className='mb-4'>
          <span className='text-lg font-bold'>{price} ₽</span>
          {oldPrice && (
            <span className='ml-2 text-sm text-gray-500 line-through'>
              {oldPrice} ₽
            </span>
          )}
          {isPrescription && <Badge>Рецептурный</Badge>}
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
          <Button onClick={handleToggleFavorite}>
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
        </div>
      </div>
    </div>
  );
});
