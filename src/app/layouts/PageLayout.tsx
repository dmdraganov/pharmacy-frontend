import { useState } from 'react';
import type { ReactNode } from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import CatalogLayout from '@/features/catalog/components/CatalogLayout';

const PageLayout = ({ children }: { children: ReactNode }) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const toggleCatalog = () => {
    setIsCatalogOpen((prev) => !prev);
  };

  const closeCatalog = () => {
    setIsCatalogOpen(false);
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <Header onToggleCatalog={toggleCatalog} />
      <main className='grow container mx-auto p-4'>
        {isCatalogOpen ? (
          <CatalogLayout onNavigate={closeCatalog} />
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
