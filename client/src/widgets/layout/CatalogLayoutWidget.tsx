import type { ReactNode } from 'react';
import { useState } from 'react';
import ProductGrid from '@/widgets/product/ProductGrid';
import type { Product } from '@/entities/product';
import Button from '@/shared/ui/Button';
import CloseIcon from '@/shared/ui/CloseIcon';

interface CatalogLayoutWidgetProps {
  title: string;
  products: Product[];
  sidebar?: ReactNode;
  footer?: ReactNode;
}

const CatalogLayoutWidget = ({
  title,
  products,
  sidebar,
  footer,
}: CatalogLayoutWidgetProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className='flex min-w-0 grow gap-6'>
      {/* Sidebar */}
      {sidebar && (
        <aside className='hidden w-72 shrink-0 overflow-y-auto py-12 lg:block'>
          {sidebar}
        </aside>
      )}

      {/* Products Grid */}
      <main className='min-w-0 grow overflow-y-auto py-8 sm:py-10 lg:py-12'>
        {sidebar && (
          <div className='mb-4 lg:hidden'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsFiltersOpen(true)}
              className='w-full sm:w-auto'
            >
              Фильтры и сортировка
            </Button>
          </div>
        )}
        <ProductGrid title={title} products={products} />
        {footer}
      </main>

      {sidebar && isFiltersOpen && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <button
            type='button'
            className='absolute inset-0 bg-black/40'
            aria-label='Закрыть фильтры'
            onClick={() => setIsFiltersOpen(false)}
          />
          <aside className='absolute inset-y-0 left-0 flex w-full max-w-sm flex-col overflow-y-auto bg-background-default p-4 shadow-lg'>
            <div className='mb-4 flex items-center justify-between border-b border-border-default pb-3'>
              <h2 className='text-xl font-bold text-text-default'>
                Фильтры
              </h2>
              <button
                type='button'
                onClick={() => setIsFiltersOpen(false)}
                className='inline-flex h-10 w-10 items-center justify-center rounded border border-border-default'
                aria-label='Закрыть фильтры'
              >
                <CloseIcon className='h-5 w-5' />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
    </div>
  );
};

export default CatalogLayoutWidget;
