import type { ReactNode } from 'react';
import { ProductCard } from '@/entities/product/';
import type { Product } from '@/entities/product';
import { useCartStore, useCartItemQuantity } from '@/features/cart';
import { usePagination } from '@/shared/hooks/usePagination';
import Pagination from '@/shared/ui/Pagination';

const ITEMS_PER_PAGE = 8;

interface ProductGridProps {
  title: ReactNode;
  products: Product[];
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const { currentData, currentPage, totalPages, goToPage } = usePagination({
    data: products,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // A helper component to manage cart quantity for each product
  const ProductCardWithCart = ({ product }: { product: Product }) => {
    const quantityInCart = useCartItemQuantity(product.id);
    return (
      <ProductCard
        key={product.id}
        product={product}
        quantityInCart={quantityInCart}
        onAddToCart={() => addToCart(product)}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={() => removeFromCart(product.id)}
      />
    );
  };

  return (
    <>
      <h1 className='mb-4 text-2xl font-bold text-text-default'>{title}</h1>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
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
