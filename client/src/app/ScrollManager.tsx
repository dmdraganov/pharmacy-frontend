import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const isCatalogPath = (pathname: string) => pathname.startsWith('/catalog');
const isCatalogMenuPath = (pathname: string) => pathname === '/catalog';

const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPathnameRef = useRef(location.pathname);
  const catalogReturnScrollRef = useRef(0);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const isOpeningCatalogMenu = isCatalogMenuPath(location.pathname);
    const isClosingCatalogWithBack =
      isCatalogMenuPath(previousPathname) && navigationType === 'POP';

    if (isOpeningCatalogMenu) {
      catalogReturnScrollRef.current = window.scrollY;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      previousPathnameRef.current = location.pathname;
      return;
    }

    if (isClosingCatalogWithBack) {
      window.scrollTo({
        top: catalogReturnScrollRef.current,
        left: 0,
        behavior: 'auto',
      });
    } else if (!isCatalogPath(location.pathname)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    previousPathnameRef.current = location.pathname;
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollManager;
