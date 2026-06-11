import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/widgets/layout/Header';
import Footer from '@/widgets/layout/Footer';
import ScrollManager from '@/app/ScrollManager';

const PageLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isFullHeightPage =
    location.pathname.startsWith('/catalog') ||
    location.pathname.startsWith('/search');
  const shouldShowFooter = !location.pathname.startsWith('/catalog');

  const mainClasses = [
    'grow container min-w-0 max-w-[1280px] mx-auto px-3 md:px-4 lg:px-6 flex flex-col',
    isFullHeightPage ? '' : 'py-8 sm:py-10 lg:py-12',
  ]
    .join(' ')
    .trim();

  return (
    <div className='flex min-h-screen flex-col'>
      <ScrollManager />
      <Header />
      <main className={mainClasses}>{children}</main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
