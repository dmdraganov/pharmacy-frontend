import { memo, useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useCartItems, useCartStore } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { CheckoutOrderSummary } from '@/widgets/checkout/CheckoutOrderSummary';
import { CheckoutDelivery } from '@/widgets/checkout/CheckoutDelivery';
import { CheckoutContactInfo } from '@/widgets/checkout/CheckoutContactInfo';
import { CheckoutPayment } from '@/widgets/checkout/CheckoutPayment';
import { CheckoutPrescription } from '@/widgets/checkout/CheckoutPrescription';
import { CheckoutActions } from '@/widgets/checkout/CheckoutActions';
import { CheckoutComments } from '@/widgets/checkout/CheckoutComments';
import Button from '@/shared/ui/Button';
import { createOrder } from '@/shared/api';
import { ROUTES } from '@/shared/config/router';

// --- Validation ---
interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
interface DeliveryAddress {
  city: string;
  street: string;
  house: string;
  apartment: string;
}
type ValidationErrors = {
  contactInfo?: Partial<Record<keyof ContactInfo, string>>;
  deliveryAddress?: Partial<Record<keyof DeliveryAddress, string>>;
  selectedPharmacy?: string;
};

// --- Components ---
const OrderSuccessMessage = () => (
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

const CheckoutPage = memo(() => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();
  const cartItems = useCartItems();
  const hasPrescriptionItems = useMemo(
    () => Object.values(cartItems).some((item) => item.isPrescription),
    [cartItems]
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // --- Unified Form State ---
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  }));
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>(
    'courier'
  );
  const effectiveDeliveryMethod = hasPrescriptionItems
    ? 'pickup'
    : deliveryMethod;
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
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
  const [comment, setComment] = useState('');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await clearCart();
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsProcessing(false);
      setIsOrderPlaced(true);
      setTimeout(() => navigate(ROUTES.account.orders), 2000);
    },
    onError: () => {
      setIsProcessing(false);
    },
  });

  // --- Validation Logic ---
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    // Validate Contact Info
    if (!contactInfo.firstName) {
      if (!newErrors.contactInfo) newErrors.contactInfo = {};
      newErrors.contactInfo.firstName = 'Имя обязательно';
    }
    if (!contactInfo.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      if (!newErrors.contactInfo) newErrors.contactInfo = {};
      newErrors.contactInfo.email = 'Введите корректный email';
    }
    if (!contactInfo.phone) {
      if (!newErrors.contactInfo) newErrors.contactInfo = {};
      newErrors.contactInfo.phone = 'Телефон обязателен';
    }

    // Validate Delivery
    if (effectiveDeliveryMethod === 'courier') {
      if (!deliveryAddress.city) {
        if (!newErrors.deliveryAddress) newErrors.deliveryAddress = {};
        newErrors.deliveryAddress.city = 'Город обязателен';
      }
      if (!deliveryAddress.street) {
        if (!newErrors.deliveryAddress) newErrors.deliveryAddress = {};
        newErrors.deliveryAddress.street = 'Улица обязательна';
      }
      if (!deliveryAddress.house) {
        if (!newErrors.deliveryAddress) newErrors.deliveryAddress = {};
        newErrors.deliveryAddress.house = 'Дом обязателен';
      }
    } else if (effectiveDeliveryMethod === 'pickup') {
      if (!selectedPharmacyId) {
        newErrors.selectedPharmacy = 'Выберите пункт самовывоза';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [contactInfo, effectiveDeliveryMethod, deliveryAddress, selectedPharmacyId]);

  // --- Order Confirmation ---
  const handleConfirmOrder = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    const items = Object.values(cartItems);
    if (items.length === 0 || !user) return;

    setIsProcessing(true);
    createOrderMutation.mutate({
      deliveryMethod:
        effectiveDeliveryMethod === 'courier' ? 'delivery' : 'pickup',
      paymentMethod,
      pharmacyId: selectedPharmacyId,
      deliveryAddress:
        effectiveDeliveryMethod === 'courier' ? deliveryAddress : null,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  }, [
    validateForm,
    cartItems,
    user,
    effectiveDeliveryMethod,
    deliveryAddress,
    selectedPharmacyId,
    paymentMethod,
    createOrderMutation,
  ]);

  if (isOrderPlaced) {
    return <OrderSuccessMessage />;
  }

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
            , чтобы продолжить.
          </p>
        </div>
      )}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <main className='flex flex-col gap-6 lg:col-span-2'>
          <CheckoutDelivery
            deliveryMethod={effectiveDeliveryMethod}
            setDeliveryMethod={(method) => {
              if (!hasPrescriptionItems || method === 'pickup') {
                setDeliveryMethod(method);
              }
            }}
            address={deliveryAddress}
            setAddress={setDeliveryAddress}
            selectedPharmacy={selectedPharmacyId}
            setSelectedPharmacy={setSelectedPharmacyId}
            errors={errors}
            isCourierDisabled={hasPrescriptionItems}
          />
          <CheckoutContactInfo
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            errors={errors.contactInfo}
          />
          <CheckoutPrescription />
          <CheckoutPayment
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
          <CheckoutComments comment={comment} setComment={setComment} />
        </main>

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
