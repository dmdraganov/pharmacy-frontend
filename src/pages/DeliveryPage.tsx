import { memo } from 'react';

const DeliveryPage = memo(() => {
  return (
    <div>
      <h1 className='mb-8 text-3xl font-bold'>Доставка и оплата</h1>

      <div className='space-y-12'>
        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Способы доставки</h2>
          <div className='space-y-4'>
            <div>
              <h3 className='text-xl font-medium'>
                Курьерская доставка по городу
              </h3>
              <p className='mt-2 text-gray-700'>
                Доставка осуществляется на следующий день после заказа. Наш
                курьер свяжется с вами за час до прибытия.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-medium'>Доставка почтой</h3>
              <p className='mt-2 text-gray-700'>
                Мы отправляем заказы почтой по всей стране. Сроки доставки
                зависят от вашего региона и составляют от 3 до 14 дней.
              </p>
            </div>
            <div>
              <h3 className='text-xl font-medium'>Самовывоз из аптеки</h3>
              <p className='mt-2 text-gray-700'>
                Вы можете забрать свой заказ самостоятельно в одной из наших
                аптек. Заказ будет готов к выдаче через 2 часа после оформления.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Стоимость доставки</h2>
          <ul className='list-inside list-disc space-y-2 text-gray-700'>
            <li>
              Курьерская доставка по городу —{' '}
              <span className='font-medium'>300 руб.</span>
            </li>
            <li>
              При заказе от 3000 руб. —{' '}
              <span className='font-medium'>бесплатно.</span>
            </li>
            <li>
              Доставка почтой —{' '}
              <span className='font-medium'>рассчитывается индивидуально.</span>
            </li>
            <li>
              Самовывоз — <span className='font-medium'>бесплатно.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Оплата</h2>
          <p className='text-gray-700'>
            Мы принимаем следующие способы оплаты:
          </p>
          <ul className='mt-4 list-inside list-disc space-y-2 text-gray-700'>
            <li>Наличными курьеру или при самовывозе.</li>
            <li>Банковской картой онлайн на сайте.</li>
            <li>Банковской картой при получении заказа.</li>
          </ul>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-semibold'>Возврат товара</h2>
          <p className='text-gray-700'>
            В соответствии с законодательством, лекарственные препараты
            надлежащего качества обмену и возврату не подлежат. В случае
            получения товара ненадлежащего качества, пожалуйста, свяжитесь с
            нами по телефону или электронной почте для оформления возврата.
          </p>
        </section>
      </div>
    </div>
  );
});

export default DeliveryPage;
