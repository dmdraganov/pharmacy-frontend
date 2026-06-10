import { memo } from 'react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product/';
import { useCartStore, useCartItemQuantity } from '@/features/cart';

export const ProductCardWithCart = memo(({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const quantityInCart = useCartItemQuantity(product.id);

  return (
    <ProductCard
      product={product}
      quantityInCart={quantityInCart}
      onAddToCart={() => addToCart(product)}
      onUpdateQuantity={updateQuantity}
      onRemoveFromCart={() => removeFromCart(product.id)}
    />
  );
});
