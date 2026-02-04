import { memo } from 'react';

const ContactsPage = memo(() => {
  return (
    <div>
      <h1 className='mb-8 text-3xl font-bold text-text-heading'>Контакты</h1>

      <div className='grid grid-cols-1 gap-12 md:grid-cols-2'>
        {/* Contact Information */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold text-text-heading'>
              Наш адрес
            </h2>
            <p className='mt-2 text-lg text-text-default'>
              г. Москва, ул. Ленина, д. 1, 123456
            </p>
          </div>

          <div>
            <h2 className='text-2xl font-semibold text-text-heading'>
              Телефон
            </h2>
            <a
              href='tel:88005553535'
              className='mt-2 text-lg text-primary-emphasis hover:underline'
            >
              8 (800) 555-35-35
            </a>
          </div>

          <div>
            <h2 className='text-2xl font-semibold text-text-heading'>
              Электронная почта
            </h2>
            <a
              href='mailto:support@pharmacy.com'
              className='mt-2 text-lg text-primary-emphasis hover:underline'
            >
              support@pharmacy.com
            </a>
          </div>

          <div>
            <h2 className='text-2xl font-semibold text-text-heading'>
              Часы работы
            </h2>
            <p className='mt-2 text-lg text-text-default'>
              Круглосуточно, без выходных
            </p>
            <p className='text-md text-text-muted'>
              (Онлайн-заказы принимаются 24/7)
            </p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div>
          <h2 className='mb-4 text-2xl font-semibold text-text-heading'>
            Мы на карте
          </h2>
          <div className='aspect-h-3 aspect-w-4 rounded-lg bg-background-muted'>
            {/* A real map component would go here */}
            <div className='flex items-center justify-center'>
              <iframe
                src='https://yandex.ru/map-widget/v1/?um=constructor%3A3da04c2d7e41bc9f3ebde9ccad5ab4ec11fe69e8db639a7c3d0bd9e62522468f&amp;source=constructor'
                width='930'
                height='560'
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContactsPage;
