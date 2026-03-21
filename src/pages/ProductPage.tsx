import { memo, useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/shared/api';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import Spinner from '@/shared/ui/Spinner';
import { ProductDetails } from '@/widgets/product/ProductDetails';
import { ProductInfo } from '@/widgets/product/ProductInfo';

const ProductPage = memo(() => {
  const { id } = useParams<{ id: string }>();

  const fetchProduct = useCallback(() => {
    if (!id) {
      return Promise.resolve(undefined); // Или отклонить Promise
    }
    return getProductById(id);
  }, [id]);

  const { data: product, isLoading, error } = useDataFetching(fetchProduct);

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
