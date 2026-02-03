import type { ReactNode } from 'react';
import { ProductCard } from '@/entities/product/';
import type { Product } from '@/entities/product';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import { usePagination } from '@/shared/hooks/usePagination';
import Pagination from '@/shared/ui/Pagination';

const ITEMS_PER_PAGE = 8;

interface ProductGridProps {
  title: ReactNode;
  products: Product[];
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
  const { addToCart, updateQuantity, removeFromCart, getQuantityInCart } =
    useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { currentData, currentPage, totalPages, goToPage } = usePagination({
    data: products,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return (
    <>
      <h1 className='mb-4 text-2xl font-bold text-text-heading'>{title}</h1>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
        {currentData.length > 0 ? (
          currentData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={getQuantityInCart(product.id)}
              isFavorite={isFavorite(product.id)}
              onAddToCart={addToCart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onToggleFavorite={toggleFavorite}
            />
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
