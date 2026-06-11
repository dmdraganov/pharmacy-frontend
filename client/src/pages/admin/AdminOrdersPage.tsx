import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminOrders, updateAdminOrderStatus } from '@/shared/api';
import type { Order, OrderStatus } from '@/entities/order';
import Spinner from '@/shared/ui/Spinner';

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'new':
      return 'Новый';
    case 'processing':
      return 'В обработке';
    case 'shipping':
      return 'Доставляется';
    case 'delivered':
      return 'Доставлен';
    case 'completed':
      return 'Завершён';
    case 'cancelled':
      return 'Отменён';
    default:
      return status;
  }
};

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case 'completed':
    case 'delivered':
      return 'bg-success-subtle text-success';
    case 'cancelled':
      return 'bg-danger-subtle text-danger';
    default:
      return 'bg-warning-subtle text-warning-text';
  }
};

const getAvailableActions = (
  status: OrderStatus
): Array<{ action: OrderStatus; label: string; className: string }> => {
  switch (status) {
    case 'new':
      return [
        {
          action: 'processing',
          label: 'В обработку',
          className: 'bg-success-subtle text-success-emphasis',
        },
        {
          action: 'cancelled',
          label: 'Отменить',
          className: 'bg-danger-subtle text-danger-emphasis',
        },
      ];
    case 'processing':
      return [
        {
          action: 'shipping',
          label: 'Отгрузить',
          className: 'bg-primary-subtle text-primary',
        },
        {
          action: 'cancelled',
          label: 'Отменить',
          className: 'bg-danger-subtle text-danger-emphasis',
        },
      ];
    case 'shipping':
      return [
        {
          action: 'delivered',
          label: 'Доставлен',
          className: 'bg-success-subtle text-success-emphasis',
        },
      ];
    case 'delivered':
      return [
        {
          action: 'completed',
          label: 'Завершить',
          className: 'bg-success-subtle text-success-emphasis',
        },
      ];
    default:
      return [];
  }
};

const getCustomerName = (order: Order) => {
  const name = [order.customer?.firstName, order.customer?.lastName]
    .filter(Boolean)
    .join(' ');

  return name || order.customer?.email || order.userId || 'Не указан';
};

const CustomerCell = ({ order }: { order: Order }) => (
  <div className='min-w-0'>
    <p className='break-words font-medium text-text-default'>
      {getCustomerName(order)}
    </p>
    {order.customer?.email && (
      <p className='break-all text-xs text-text-muted'>
        {order.customer.email}
      </p>
    )}
    {order.customer?.phone && (
      <p className='text-xs text-text-muted'>{order.customer.phone}</p>
    )}
  </div>
);

const OrderActions = ({
  order,
  loadingAction,
  onAction,
}: {
  order: Order;
  loadingAction: string | null;
  onAction: (orderId: string, status: OrderStatus) => void;
}) => {
  const actions = getAvailableActions(order.status);

  if (actions.length === 0) {
    return <span className='text-xs text-text-muted'>Нет действий</span>;
  }

  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      {actions.map((action) => {
        const actionKey = `${action.action}-${order.id}`;
        return (
          <button
            key={action.action}
            onClick={() => onAction(order.id, action.action)}
            disabled={loadingAction === actionKey}
            className={`rounded-md px-2 py-1 text-xs disabled:opacity-50 ${action.className}`}
          >
            {loadingAction === actionKey ? '...' : action.label}
          </button>
        );
      })}
    </div>
  );
};

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: getAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => updateAdminOrderStatus(orderId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onSettled: () => {
      setLoadingAction(null);
    },
  });

  const handleAction = (orderId: string, status: OrderStatus) => {
    setLoadingAction(`${status}-${orderId}`);
    updateStatusMutation.mutate({ orderId, status });
  };

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 items-center justify-center text-center text-danger'>
        <p>Не удалось загрузить заказы.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='mb-4 text-2xl font-bold text-text-default'>Заказы</h1>
      <div className='my-6 overflow-x-auto rounded bg-background-default shadow-md'>
        <table className='hidden min-w-full table-auto md:table'>
          <thead>
            <tr className='text-text-muted bg-background-muted text-sm uppercase leading-normal'>
              <th className='px-6 py-3 text-left'>ID заказа</th>
              <th className='px-6 py-3 text-left'>Заказчик</th>
              <th className='px-6 py-3 text-left'>Дата</th>
              <th className='px-6 py-3 text-center'>Статус</th>
              <th className='px-6 py-3 text-left'>Состав</th>
              <th className='px-6 py-3 text-center'>Сумма</th>
              <th className='px-6 py-3 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light text-text-muted'>
            {orders.map((order) => (
              <tr
                key={order.id}
                className='border-b border-border-default hover:bg-background-muted-hover'
              >
                <td className='whitespace-nowrap px-6 py-3 text-left text-text-default'>
                  {order.id}
                </td>
                <td className='px-6 py-3 text-left text-text-muted'>
                  <CustomerCell order={order} />
                </td>
                <td className='px-6 py-3 text-left text-text-default'>
                  {new Date(order.date).toLocaleDateString('ru-RU')}
                </td>
                <td className='px-6 py-3 text-center'>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className='px-6 py-3 text-left text-text-default'>
                  <ul className='list-inside list-disc'>
                    {order.items.map((item) => (
                      <li key={item.product.id}>
                        {item.product.name} ({item.quantity} x {item.price} ₽)
                      </li>
                    ))}
                  </ul>
                </td>
                <td className='px-6 py-3 text-center font-semibold text-text-default'>
                  {order.total.toFixed(2)} ₽
                </td>
                <td className='px-6 py-3 text-center'>
                  <OrderActions
                    order={order}
                    loadingAction={loadingAction}
                    onAction={handleAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='md:hidden'>
          {orders.map((order) => (
            <div key={order.id} className='border-b border-border-default p-4'>
              <div className='mb-2 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between'>
                <div className='min-w-0'>
                  <h3 className='break-all font-bold text-text-default'>
                    {order.id}
                  </h3>
                  <p className='text-sm'>
                    {new Date(order.date).toLocaleDateString('ru-RU')}
                  </p>
                  <div className='mt-1 text-sm text-text-muted'>
                    <CustomerCell order={order} />
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div>
                <h4 className='font-semibold text-text-default'>Состав:</h4>
                <ul className='list-inside list-disc pl-2 text-sm'>
                  {order.items.map((item) => (
                    <li key={item.product.id} className='break-words'>
                      {item.product.name} ({item.quantity} x {item.price} ₽)
                    </li>
                  ))}
                </ul>
              </div>
              <p className='mt-2 text-right font-bold text-text-default'>
                Итого: {order.total.toFixed(2)} ₽
              </p>
              <div className='mt-4 flex justify-start min-[420px]:justify-end'>
                <OrderActions
                  order={order}
                  loadingAction={loadingAction}
                  onAction={handleAction}
                />
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <p className='p-6 text-center text-text-muted'>Заказов пока нет.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
