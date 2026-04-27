import { memo, useMemo, useState } from 'react';
import { useAuthStore } from '@/features/auth';
import { useOrderStore, type OrderStatus, type Order } from '@/entities/order';
import { OrderList } from '@/widgets/order/OrderList';
import { OrderHistory } from '@/widgets/order/OrderHistory';
import EmptyState from '@/shared/ui/EmptyState';
import Spinner from '@/shared/ui/Spinner';
import TabButton from '@/shared/ui/TabButton';

const ACTIVE_STATUSES: OrderStatus[] = ['new', 'processing', 'shipping'];
type Tab = 'current' | 'history';

const AccountOrdersPage = memo(() => {
  const { user, isAuthLoading } = useAuthStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<Tab>('current');

  const userOrders = useMemo(() => {
    if (!user) return [];
    return orders.filter((o) => o.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, user]);

  const [currentOrders, orderHistory] = useMemo(() => {
    const current: Order[] = [];
    const history: Order[] = [];
    for (const order of userOrders) {
      if (ACTIVE_STATUSES.includes(order.status)) {
        current.push(order);
      } else {
        history.push(order);
      }
    }
    return [current, history];
  }, [userOrders]);

  if (!user && !isAuthLoading) {
    return (
      <EmptyState
        title='Войдите, чтобы увидеть заказы'
        description='Для доступа к истории заказов необходимо войти в свой аккаунт.'
        buttonText='Войти'
        linkTo='/login'
      />
    );
  }

  if (isAuthLoading) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (userOrders.length === 0) {
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
    <div className='flex flex-col gap-6'>
      <div className='flex border-b border-border-default'>
        <TabButton
          isActive={activeTab === 'current'}
          onClick={() => setActiveTab('current')}
        >
          Текущие ({currentOrders.length})
        </TabButton>
        <TabButton
          isActive={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        >
          История ({orderHistory.length})
        </TabButton>
      </div>

      <div>
        {activeTab === 'current' && (
          <>
            {currentOrders.length > 0 ? (
              <OrderList orders={currentOrders} />
            ) : (
              <EmptyState
                title='Нет активных заказов'
                description='Ваши текущие заказы будут отображаться здесь.'
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {orderHistory.length > 0 ? (
              <OrderHistory orders={orderHistory} />
            ) : (
              <EmptyState
                title='История заказов пуста'
                description='Здесь будут отображаться ваши завершенные и отмененные заказы.'
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default AccountOrdersPage;
