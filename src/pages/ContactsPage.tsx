import { memo } from 'react';

const ContactsPage = memo(() => {
  return (
    <div>
      <h1 className='mb-8 text-3xl font-bold'>Контакты</h1>

      <div className='grid grid-cols-1 gap-12 md:grid-cols-2'>
        {/* Contact Information */}
        <div className='space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold'>Наш адрес</h2>
            <p className='mt-2 text-lg text-gray-700'>
              г. Москва, ул. Ленина, д. 1, 123456
            </p>
          </div>

          <div>
            <h2 className='text-2xl font-semibold'>Телефон</h2>
            <a
              href='tel:88005553535'
              className='mt-2 text-lg text-blue-600 hover:underline'
            >
              8 (800) 555-35-35
            </a>
          </div>

          <div>
            <h2 className='text-2xl font-semibold'>Электронная почта</h2>
            <a
              href='mailto:support@pharmacy.com'
              className='mt-2 text-lg text-blue-600 hover:underline'
            >
              support@pharmacy.com
            </a>
          </div>

          <div>
            <h2 className='text-2xl font-semibold'>Часы работы</h2>
            <p className='mt-2 text-lg text-gray-700'>
              Круглосуточно, без выходных
            </p>
            <p className='text-md text-gray-500'>
              (Онлайн-заказы принимаются 24/7)
            </p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div>
          <h2 className='mb-4 text-2xl font-semibold'>Мы на карте</h2>
          <div className='aspect-h-3 aspect-w-4 rounded-lg bg-gray-200'>
            {/* A real map component would go here */}
            <div className='flex items-center justify-center'>
              <p className='text-gray-500'>Карта будет здесь</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContactsPage;
