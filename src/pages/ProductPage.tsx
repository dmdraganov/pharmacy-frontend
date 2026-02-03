import { memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { ProductDetails } from '@/widgets/ProductDetails';
import { ProductInfo } from '@/widgets/ProductInfo';

const ProductPage = memo(() => {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);

  if (!product) {
    return (
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-text-heading'>
          Товар не найден
        </h1>
        <Link to='/catalog' className='text-primary hover:underline'>
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <>
      <ProductDetails product={product} />
      <ProductInfo product={product} />
    </>
  );
});

export default ProductPage;
