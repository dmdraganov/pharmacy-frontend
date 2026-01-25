import { memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import Badge from '@/shared/ui/Badge';
import Button from '@/shared/ui/Button';
import QuantityControl from '@/shared/ui/QuantityControl';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';

const ProductPage = memo(() => {
  const { id } = useParams();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  const quantityInCart = useMemo(
    () => items.find((item) => item.id === product?.id)?.quantity || 0,
    [items, product]
  );

  if (!product) {
    return (
      <>
        <h1 className='text-2xl font-bold'>Товар не найден</h1>
        <Link to='/catalog'>Вернуться в каталог</Link>
      </>
    );
  }

  const handleAddProduct = () => {
    addToCart(product);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (product) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleRemoveProduct = () => {
    if (product) {
      removeFromCart(product.id);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
      <div>
        <img
          src={product.image}
          alt={product.name}
          className='w-full rounded-lg'
        />
      </div>
      <div>
        <h1 className='mb-2 text-3xl font-bold'>{product.name}</h1>
        <p className='mb-4 text-lg text-gray-600'>{product.brand}</p>

        {product.isPrescription && <Badge className='mb-4'>Рецептурный</Badge>}

        <div className='mb-6'>
          <span className='text-4xl font-bold'>{product.price} ₽</span>
          {product.oldPrice && (
            <span className='ml-3 text-xl text-gray-500 line-through'>
              {product.oldPrice} ₽
            </span>
          )}
        </div>

        <div className='flex flex-col gap-4'>
          {quantityInCart === 0 ? (
            <Button onClick={handleAddProduct}>Добавить в корзину</Button>
          ) : (
            <div className='flex items-center justify-between'>
              <Button as={Link} to="/cart" variant='primary'>
                К корзине
              </Button>
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

export default ProductPage;
