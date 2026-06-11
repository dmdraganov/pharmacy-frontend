import { memo, useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useHasPrescriptionItems } from '@/features/cart';
import { useAuthStore } from '@/features/auth';
import { CheckoutOrderSummary } from '@/widgets/checkout/CheckoutOrderSummary';
import { CheckoutDelivery } from '@/widgets/checkout/CheckoutDelivery';
import { CheckoutPayment } from '@/widgets/checkout/CheckoutPayment';
import { CheckoutActions } from '@/widgets/checkout/CheckoutActions';
import { CheckoutComments } from '@/widgets/checkout/CheckoutComments';
import Button from '@/shared/ui/Button';
import { createOrder } from '@/shared/api';
import { ApiError } from '@/shared/api/apiClient';
import { ROUTES } from '@/shared/config/router';
import type { CardDetails } from '@/widgets/checkout/CheckoutPayment';

interface DeliveryAddress {
  city: string;
  street: string;
  house: string;
  apartment: string;
}
type ValidationErrors = {
  deliveryAddress?: Partial<Record<keyof DeliveryAddress, string>>;
  selectedPharmacy?: string;
  cardDetails?: Partial<Record<keyof CardDetails, string>>;
};

const fieldError = (errors: Record<string, string[]> | undefined, key: string) =>
  errors?.[key]?.[0];

const isValidCardExpiry = (value: string) => {
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

const mapCheckoutErrors = (error: unknown): {
  formError: string;
  fieldErrors: ValidationErrors;
} => {
  if (!(error instanceof ApiError)) {
    return {
      formError: 'Не удалось оформить заказ. Проверьте соединение и попробуйте снова.',
      fieldErrors: {},
    };
  }

  const fieldErrors: ValidationErrors = {};
  const deliveryAddressError = fieldError(error.errors, 'delivery_address');

  if (
    deliveryAddressError ||
    fieldError(error.errors, 'delivery_city') ||
    fieldError(error.errors, 'delivery_street') ||
    fieldError(error.errors, 'delivery_house')
  ) {
    fieldErrors.deliveryAddress = {
      city: fieldError(error.errors, 'delivery_city') || deliveryAddressError,
      street: fieldError(error.errors, 'delivery_street') || deliveryAddressError,
      house: fieldError(error.errors, 'delivery_house'),
    };
  }

  const pharmacyError = fieldError(error.errors, 'pharmacy_id');
  if (pharmacyError) {
    fieldErrors.selectedPharmacy = pharmacyError;
  }

  return {
    formError:
      error.status === 401
        ? 'Сессия истекла. Войдите в аккаунт и повторите оформление.'
        : error.message || 'Не удалось оформить заказ. Проверьте данные и попробуйте снова.',
    fieldErrors,
  };
};

// --- Components ---
const OrderSuccessMessage = () => (
  <div className='flex flex-col items-center justify-center rounded-lg border border-border-default bg-background-default p-6 text-center sm:p-12'>
    <h1 className='mb-4 text-2xl font-bold text-success sm:text-3xl'>
      Заказ успешно оформлен!
    </h1>
    <p className='mb-6 text-text-default'>
      Спасибо за покупку! Информация о заказе уже доступна в вашем личном
      кабинете.
    </p>
    <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4'>
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
  const user = useAuthStore((state) => state.user);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasPrescriptionItems = useHasPrescriptionItems();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

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
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [comment, setComment] = useState('');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState('');
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await clearCart();
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsProcessing(false);
      setIsOrderPlaced(true);
      setTimeout(() => navigate(ROUTES.account.orders), 2000);
    },
    onError: (error) => {
      const { formError, fieldErrors } = mapCheckoutErrors(error);
      setFormError(formError);
      setErrors((currentErrors) => ({ ...currentErrors, ...fieldErrors }));
      setIsProcessing(false);
    },
  });

  // --- Validation Logic ---
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

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

    if (paymentMethod === 'online') {
      const cardErrors: Partial<Record<keyof CardDetails, string>> = {};
      const cardNumberDigits = cardDetails.number.replace(/\D/g, '');
      const cvvDigits = cardDetails.cvv.replace(/\D/g, '');

      if (cardNumberDigits.length !== 16) {
        cardErrors.number = 'Введите 16 цифр карты';
      }
      if (!isValidCardExpiry(cardDetails.expiry)) {
        cardErrors.expiry = 'Введите действительный срок в формате ММ/ГГ';
      }
      if (cvvDigits.length < 3 || cvvDigits.length > 4) {
        cardErrors.cvv = 'Введите 3 или 4 цифры';
      }

      if (Object.keys(cardErrors).length > 0) {
        newErrors.cardDetails = cardErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    effectiveDeliveryMethod,
    deliveryAddress,
    selectedPharmacyId,
    paymentMethod,
    cardDetails,
  ]);

  // --- Order Confirmation ---
  const handleConfirmOrder = useCallback(() => {
    if (!validateForm()) {
      setFormError('Проверьте выделенные поля перед подтверждением заказа.');
      return;
    }

    const items = Object.values(useCartStore.getState().items);
    if (items.length === 0) {
      setFormError('Корзина пуста. Добавьте товары перед оформлением заказа.');
      return;
    }
    if (!user) {
      setFormError('Войдите в аккаунт, чтобы оформить заказ.');
      return;
    }

    setFormError('');
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
      <h1 className='mb-6 text-2xl font-bold text-text-default sm:mb-8 sm:text-3xl'>
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
      {formError && (
        <div className='mb-6 rounded-lg border border-danger bg-danger-subtle p-4 text-danger'>
          {formError}
        </div>
      )}
      <div className='grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8'>
        <main className='flex min-w-0 flex-col gap-6 lg:col-span-2'>
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
          <CheckoutPayment
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardDetails={cardDetails}
            setCardDetails={setCardDetails}
            errors={errors.cardDetails}
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
