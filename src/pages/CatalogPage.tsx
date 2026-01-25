import { memo } from 'react';
import { CatalogLayout } from '@/features/catalog';

const CatalogPage = memo(() => {
  return (
    <>
      <h1 className='mb-4 text-2xl font-bold'>Каталог</h1>
      <CatalogLayout />
    </>
  );
});

export default CatalogPage;
