import { memo, useMemo } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/entities/product/ui/ProductCard';
import { useCart } from '@/features/cart';
import { useFavorites } from '@/features/favorites';
import { usePagination } from '@/shared/hooks/usePagination';
import Pagination from '@/shared/ui/Pagination';
import { useParams } from 'react-router-dom';
import { categories } from '@/data/categories';
import type { Product } from '@/entities/product/model';

const ITEMS_PER_PAGE = 8;

const ProductListPage = memo(() => {
  const { category, subcategory } = useParams<{
    category?: string;
    subcategory?: string;
  }>();

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentCategory = useMemo(
    () =>
      category ? categories.find((cat) => cat.id === category) : undefined,
    [category]
  );
  const currentSubcategory = useMemo(
    () =>
      subcategory
        ? currentCategory?.subcategories.find((sub) => sub.id === subcategory)
        : undefined,
    [subcategory, currentCategory]
  );

  const filteredProducts = useMemo(() => {
    let prods = products;
    if (category) {
      prods = prods.filter((p) => p.categoryId === category);
    }
    if (subcategory) {
      prods = prods.filter((p) => p.subcategoryId === subcategory);
    }
    return prods;
  }, [category, subcategory]);

  const { currentData, currentPage, totalPages, goToPage } = usePagination({
    data: filteredProducts,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const getQuantityInCart = (productId: string) => {
    return items.find((item) => item.id === productId)?.quantity || 0;
  };

  const handleAddProduct = (product: Product) => {
    addToCart(product);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveProduct = (productId: string) => {
    removeFromCart(productId);
  };

  return (
    <>
      <h1 className='mb-4 text-2xl font-bold'>
        {currentSubcategory?.name || currentCategory?.name || 'Все товары'}
      </h1>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {currentData.length > 0 ? (
          currentData.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              quantityInCart={getQuantityInCart(product.id)}
              isFavorite={isFavorite(product.id)}
              onAddProduct={() => handleAddProduct(product)}
              onUpdateQuantity={(newQuantity) =>
                handleUpdateQuantity(product.id, newQuantity)
              }
              onRemoveProduct={() => handleRemoveProduct(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
            />
          ))
        ) : (
          <p>Пока нет товаров.</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
    </>
  );
});

export default ProductListPage;
