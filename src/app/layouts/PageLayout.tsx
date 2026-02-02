import type { ReactNode } from 'react';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='grow container mx-auto p-4 flex flex-col'>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
