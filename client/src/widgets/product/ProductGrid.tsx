import type { ReactNode } from 'react';
import type { Product } from '@/entities/product';
import { ProductCardWithCart } from '@/widgets/product/ProductCardWithCart';
import { usePagination } from '@/shared/hooks/usePagination';
import Pagination from '@/shared/ui/Pagination';

const ITEMS_PER_PAGE = 8;

interface ProductGridProps {
  title: ReactNode;
  products: Product[];
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
  const { currentData, currentPage, totalPages, goToPage } = usePagination({
    data: products,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <>
      <h1 className='mb-4 text-2xl font-bold text-text-default sm:text-3xl'>
        {title}
      </h1>
      <div className='grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6'>
        {currentData.length > 0 ? (
          currentData.map((product) => (
            <ProductCardWithCart key={product.id} product={product} />
          ))
        ) : (
          <p className='text-text-default'>Пока нет товаров.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className='mt-4'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        </div>
      )}
    </>
  );
};

export default ProductGrid;
