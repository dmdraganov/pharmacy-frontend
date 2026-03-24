import { memo, useMemo } from 'react';
import { useOrderStore, type OrderStatus, type Order } from '@/entities/order';
import { useDataFetching } from '@/shared/hooks/useDataFetching';
import { getOrders } from '@/shared/api';
import { OrderList } from '@/widgets/order/OrderList';
import { OrderHistory } from '@/widgets/order/OrderHistory';
import EmptyState from '@/shared/ui/EmptyState';
import Spinner from '@/shared/ui/Spinner';

const ACTIVE_STATUSES: OrderStatus[] = ['new', 'processing', 'shipping'];

const AccountOrdersPage = memo(() => {
  const { orders: runtimeOrders } = useOrderStore();
  const { data: mockOrders, isLoading } = useDataFetching(getOrders);

  const allOrders = useMemo(() => {
    const runtimeOrderIds = new Set(runtimeOrders.map((o) => o.id));
    const filteredMockOrders = (mockOrders || []).filter(
      (mockOrder) => !runtimeOrderIds.has(mockOrder.id)
    );
    return [...runtimeOrders, ...filteredMockOrders];
  }, [runtimeOrders, mockOrders]);

  const [currentOrders, orderHistory] = useMemo(() => {
    const current: Order[] = [];
    const history: Order[] = [];
    for (const order of allOrders) {
      if (ACTIVE_STATUSES.includes(order.status)) {
        current.push(order);
      } else {
        history.push(order);
      }
    }
    return [current, history];
  }, [allOrders]);

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <EmptyState
        title='У вас еще нет заказов'
        description='Сделайте свой первый заказ, чтобы увидеть его здесь.'
        buttonText='Перейти к покупкам'
        linkTo='/'
      />
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      {currentOrders.length > 0 ? (
        <div>
          <h2 className='mb-4 text-2xl font-bold text-text-default'>
            Текущие заказы
          </h2>
          <OrderList orders={currentOrders} />
        </div>
      ) : (
        <EmptyState
          title='Нет активных заказов'
          description='Ваши текущие заказы будут отображаться здесь.'
        />
      )}
      <OrderHistory orders={orderHistory} />
    </div>
  );
});

export default AccountOrdersPage;
