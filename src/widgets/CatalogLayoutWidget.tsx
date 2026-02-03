import type { ReactNode } from 'react';
import ProductGrid from '@/widgets/ProductGrid';
import type { Product } from '@/entities/product';

interface CatalogLayoutWidgetProps {
  title: string;
  products: Product[];
  sidebar?: ReactNode;
}

const CatalogLayoutWidget = ({
  title,
  products,
  sidebar,
}: CatalogLayoutWidgetProps) => {
  return (
    <div className='flex flex-grow'>
      {/* Sidebar */}
      {sidebar && (
        <aside className='hidden md:block w-72 shrink-0 overflow-y-auto py-12 px-6'>
          {sidebar}
        </aside>
      )}

      {/* Products Grid */}
      <main className='flex-grow overflow-y-auto py-12 px-6'>
        <ProductGrid title={title} products={products} />
      </main>
    </div>
  );
};

export default CatalogLayoutWidget;
