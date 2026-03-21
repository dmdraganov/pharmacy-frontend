import { memo } from 'react';
import { CurrentOrder } from '@/widgets/order/CurrentOrder';
import { OrderHistory } from '@/widgets/order/OrderHistory';

const AccountOrdersPage = memo(() => {
  return (
    <>
      <CurrentOrder />
      <OrderHistory />
    </>
  );
});

export default AccountOrdersPage;
