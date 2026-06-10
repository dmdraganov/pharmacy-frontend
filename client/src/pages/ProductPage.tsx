import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/shared/api';
import Spinner from '@/shared/ui/Spinner';
import { ProductDetails } from '@/widgets/product/ProductDetails';
import { ProductInfo } from '@/widgets/product/ProductInfo';

const ProductPage = memo(() => {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке товара</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-text-default'>
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
