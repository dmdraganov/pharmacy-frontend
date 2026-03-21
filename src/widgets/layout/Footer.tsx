import { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
  return (
    <footer className='border-t border-border-default bg-background-muted'>
      <div className='container max-w-[1280px] mx-auto px-3 md:px-4 lg:px-6 py-8'>
        <div className='flex flex-col gap-8 md:flex-row md:gap-19'>
          <div>
            <h3 className='mb-4 text-lg font-medium text-text-heading'>
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
          <div>
            <h3 className='mb-4 text-lg font-medium text-text-heading'>
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
          <div>
            <h3 className='mb-4 text-lg font-medium text-text-heading'>
              Обратная связь
            </h3>
            <ul className='space-y-2 text-text-muted'>
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
