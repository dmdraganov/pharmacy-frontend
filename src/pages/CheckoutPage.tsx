import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart';
import { CheckoutOrderSummary } from '@/widgets/CheckoutOrderSummary';
import { CheckoutDelivery } from '@/widgets/CheckoutDelivery';
import { CheckoutContactInfo } from '@/widgets/CheckoutContactInfo';
import { CheckoutPayment } from '@/widgets/CheckoutPayment';
import { CheckoutPrescription } from '@/widgets/CheckoutPrescription';
import { CheckoutActions } from '@/widgets/CheckoutActions';
import Button from '@/shared/ui/Button';

const OrderSuccessMessage = () => (
  <div className='flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center shadow-sm'>
    <h1 className='mb-4 text-3xl font-bold text-green-600'>Заказ успешно оформлен!</h1>
    <p className='mb-6 text-gray-700'>
      Спасибо за покупку! Информация о заказе отправлена на ваш e-mail.
    </p>
    <Button as={Link} to='/' variant='primary'>
      Вернуться на главную
    </Button>
  </div>
);

const CheckoutPage = memo(() => {
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      setIsOrderPlaced(true);
    }, 1500); // Simulate network delay
  };

  if (isOrderPlaced) {
    return <OrderSuccessMessage />;
  }

  return (
    <>
      <h1 className='mb-8 text-3xl font-bold'>Оформление заказа</h1>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <main className='flex flex-col gap-6 lg:col-span-2'>
          <CheckoutDelivery />
          <CheckoutContactInfo />
          <CheckoutPrescription />
          <CheckoutPayment />
        </main>

        {/* Sidebar */}
        <aside className='lg:sticky lg:top-24 h-min'>
          <div className='flex flex-col gap-6'>
            <CheckoutOrderSummary />
            <CheckoutActions
              onConfirm={handleConfirmOrder}
              isProcessing={isProcessing}
            />
          </div>
        </aside>
      </div>
    </>
  );
});

export default CheckoutPage;
