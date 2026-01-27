import { memo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';
import type { Product } from '@/entities/product/model';

interface ProductCardProps extends Product {
  isFavorite: boolean;
  quantityInCart: number; // New prop: 0 if not in cart, >0 if in cart
  onAddProduct: () => void; // For initial add to cart
  onUpdateQuantity: (newQuantity: number) => void; // For quantity control
  onRemoveProduct: () => void; // For removing product when quantity is 0
  onToggleFavorite: () => void;
}

const ProductCard = memo((props: ProductCardProps) => {
  const {
    id,
    name,
    brand,
    price,
    oldPrice,
    isPrescription,
    image,
    isFavorite,
    quantityInCart,
    onAddProduct,
    onUpdateQuantity,
    onRemoveProduct,
    onToggleFavorite,
  } = props;

  const handleIncrement = () => onUpdateQuantity(quantityInCart + 1);
  const handleDecrement = () => {
    if (quantityInCart - 1 <= 0) {
      onRemoveProduct();
    } else {
      onUpdateQuantity(quantityInCart - 1);
    }
  };

  return (
    <div className='flex flex-col overflow-hidden rounded border shadow-lg'>
      <Link to={`/product/${id}`} className='group block'>
        <img
          className='w-full transition-transform duration-300 group-hover:scale-105'
          src={image}
          alt={name}
        />
        <div className='px-6 py-4'>
          <div className='mb-2 truncate text-xl font-bold' title={name}>
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
            <Button onClick={onAddProduct}>Добавить в корзину</Button>
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
          <Button onClick={onToggleFavorite}>
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
