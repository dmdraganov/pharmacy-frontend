import { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
  return (
    <footer className='border-t border-border-default bg-background-muted'>
      <div className='container max-w-7xl mx-auto px-3 md:px-4 lg:px-6 py-8'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16'>
          <div className='min-w-0'>
            <h3 className='mb-4 text-lg font-medium text-text-default'>
              О компании
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/about'
                  className='text-text-muted hover:text-primary'
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  to='/contacts'
                  className='text-text-muted hover:text-primary'
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          <div className='min-w-0'>
            <h3 className='mb-4 text-lg font-medium text-text-default'>
              Покупателям
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/delivery'
                  className='text-text-muted hover:text-primary'
                >
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link
                  to='/privacy-policy'
                  className='text-text-muted hover:text-primary'
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
          <div className='min-w-0 sm:col-span-2 lg:col-span-1'>
            <h3 className='mb-4 text-lg font-medium text-text-default'>
              Обратная связь
            </h3>
            <ul className='space-y-2 break-words text-text-muted'>
              <li>
                Телефон:{' '}
                <a
                  href='tel:88005553535'
                  className='text-text-muted hover:text-primary'
                >
                  8 (800) 555-35-35
                </a>
              </li>
              <li>
                Email:{' '}
                <a
                  href='mailto:support@pharmacy.com'
                  className='text-text-muted hover:text-primary'
                >
                  support@pharmacy.com
                </a>
              </li>
              <li>Адрес: г. Москва, ул. Ленина, д. 1</li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t border-border-default pt-4 text-center text-text-muted'>
          <p>© 2026 DivMedica. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
