import { memo } from 'react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product';
import { useAuthStore } from '@/features/auth';
import { useCartStore, useCartItemQuantity } from '@/features/cart';
import { FavoriteButton } from '@/features/favorites';

export const ProductCardWithCart = memo(({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const quantityInCart = useCartItemQuantity(product.id);
  const isAuthenticated = useAuthStore((state) => Boolean(state.user));

  return (
    <ProductCard
      product={product}
      quantityInCart={quantityInCart}
      onAddToCart={() => addToCart(product)}
      onUpdateQuantity={updateQuantity}
      onRemoveFromCart={() => removeFromCart(product.id)}
      favoriteAction={
        <FavoriteButton
          productId={product.id}
          isAuthenticated={isAuthenticated}
          className='absolute top-3 right-3'
        />
      }
    />
  );
});
