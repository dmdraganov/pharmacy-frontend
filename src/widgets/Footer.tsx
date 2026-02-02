import { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = memo(() => {
  return (
    <footer className='border-t bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col gap-8 md:flex-row md:gap-19'>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>О компании</h3>
            <ul className='space-y-2'>
              <li>
                <Link to='/about' className='text-gray-600 hover:text-blue-500'>
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  to='/contacts'
                  className='text-gray-600 hover:text-blue-500'
                >
                  Обратная связь
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Покупателям</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/delivery'
                  className='text-gray-600 hover:text-blue-500'
                >
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link
                  to='/privacy-policy'
                  className='text-gray-600 hover:text-blue-500'
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Обратная связь</h3>
            <ul className='space-y-2 text-gray-600'>
              <li>
                Телефон:{' '}
                <a
                  href='tel:88005553535'
                  className='text-gray-600 hover:text-blue-500'
                >
                  8 (800) 555-35-35
                </a>
              </li>
              <li>
                Email:{' '}
                <a
                  href='mailto:support@pharmacy.com'
                  className='text-gray-600 hover:text-blue-500'
                >
                  support@pharmacy.com
                </a>
              </li>
              <li>Адрес: г. Москва, ул. Ленина, д. 1</li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t pt-4 text-center text-gray-500'>
          <p>© 2026 DivMedica. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
