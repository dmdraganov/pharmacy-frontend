import { memo, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAllCartTotals, useCartItems, useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { CheckoutOrderSummary } from '@/widgets/checkout/CheckoutOrderSummary';
import { CheckoutDelivery } from '@/widgets/checkout/CheckoutDelivery';
import { CheckoutContactInfo } from '@/widgets/checkout/CheckoutContactInfo';
import { CheckoutPayment } from '@/widgets/checkout/CheckoutPayment';
import { CheckoutPrescription } from '@/widgets/checkout/CheckoutPrescription';
import { CheckoutActions } from '@/widgets/checkout/CheckoutActions';
import Button from '@/shared/ui/Button';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import { getPharmacies } from '@/shared/api';
import { useOrderStore, type Order, type OrderItem } from '@/entities/order';
import { ROUTES } from '@/shared/config/router';

const OrderSuccessMessage = () => {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg border border-border-default bg-background-default p-12 text-center'>
      <h1 className='mb-4 text-3xl font-bold text-success'>
        Заказ успешно оформлен!
      </h1>
      <p className='mb-6 text-text-default'>
        Спасибо за покупку! Информация о заказе уже доступна в вашем личном
        кабинете.
      </p>
      <div className='flex gap-4'>
        <Button as={Link} to={ROUTES.home} variant='secondary'>
          Вернуться на главную
        </Button>
        <Button as={Link} to={ROUTES.account.orders} variant='primary'>
          Посмотреть заказы
        </Button>
      </div>
    </div>
  );
};

const CheckoutPage = memo(() => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const cartItems = useCartItems();
  const { total } = useAllCartTotals();

  // State for delivery and payment
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  );
  const [address, setAddress] = useState({
    city: '',
    street: '',
    house: '',
    apartment: '',
  });
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'on-receipt'>(
    'online'
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const { data: pharmacies } = useDataFetching(getPharmacies);

  const handleConfirmOrder = useCallback(() => {
    const items = Object.values(cartItems);
    if (items.length === 0 || !user) return; // Guard against no user

    setIsProcessing(true);

    // Determine delivery info and address object
    let deliveryInfo = '';
    let deliveryAddress: Order['deliveryAddress'] = null;

    if (deliveryMethod === 'courier') {
      const { city, street, house, apartment } = address;
      deliveryInfo = [
        city,
        street,
        house && `д. ${house}`,
        apartment && `кв. ${apartment}`,
      ]
        .filter(Boolean)
        .join(', ');
      if (!deliveryInfo) deliveryInfo = 'Адрес не указан';
      deliveryAddress = address;
    } else if (deliveryMethod === 'pickup' && selectedPharmacyId) {
      const pharmacy = pharmacies?.find((p) => p.id === selectedPharmacyId);
      deliveryInfo = pharmacy?.name ?? 'Неизвестная аптека';
    }

    // Simulate network delay
    setTimeout(() => {
      const orderItems: OrderItem[] = items.map((item) => ({
        product: item,
        quantity: item.quantity,
        price: item.price,
      }));

      const newOrder: Order = {
        id: new Date().toISOString(),
        userId: user.id, // Associate order with user
        date: new Date().toISOString(),
        status: 'new',
        items: orderItems,
        total,
        deliveryMethod: deliveryMethod === 'courier' ? 'delivery' : 'pickup',
        deliveryInfo,
        deliveryAddress,
        paymentMethod,
      };

      addOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      setIsOrderPlaced(true);

      // Redirect to orders page after a short delay
      setTimeout(() => navigate(ROUTES.account.orders), 2000);
    }, 1500);
  }, [
    cartItems,
    total,
    addOrder,
    clearCart,
    navigate,
    deliveryMethod,
    address,
    selectedPharmacyId,
    paymentMethod,
    pharmacies,
    user, // Add user to dependency array
  ]);

  if (isOrderPlaced) {
    return <OrderSuccessMessage />;
  }

  // Disable confirmation if not logged in
  const isConfirmDisabled = isProcessing || !user;

  return (
    <>
      <h1 className='mb-8 text-3xl font-bold text-text-default'>
        Оформление заказа
      </h1>
      {!user && (
        <div className='mb-6 rounded-lg border border-warning bg-warning/10 p-4 text-warning'>
          <p>
            Пожалуйста,{' '}
            <Link to={ROUTES.login} className='font-bold underline'>
              войдите в свой аккаунт
            </Link>
            , чтобы продолжить оформление заказа.
          </p>
        </div>
      )}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <main className='flex flex-col gap-6 lg:col-span-2'>
          <CheckoutDelivery
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            address={address}
            setAddress={setAddress}
            selectedPharmacy={selectedPharmacyId}
            setSelectedPharmacy={setSelectedPharmacyId}
          />
          <CheckoutContactInfo />
          <CheckoutPrescription />
          <CheckoutPayment
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </main>

        {/* Sidebar */}
        <aside className='lg:sticky lg:top-24 h-min'>
          <div className='flex flex-col gap-6'>
            <CheckoutOrderSummary />
            <CheckoutActions
              onConfirm={handleConfirmOrder}
              isProcessing={isConfirmDisabled}
            />
          </div>
        </aside>
      </div>
    </>
  );
});

export default CheckoutPage;
