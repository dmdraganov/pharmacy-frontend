import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';

const PageLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isFullHeightPage =
    location.pathname.startsWith('/catalog') ||
    location.pathname.startsWith('/search');

  const mainClasses = [
    'grow container max-w-[1280px] mx-auto px-3 md:px-4 lg:px-6 flex flex-col',
    isFullHeightPage ? '' : 'py-12',
  ]
    .join(' ')
    .trim();

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className={mainClasses}>{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
