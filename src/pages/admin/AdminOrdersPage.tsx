import { useDataFetching } from '@/shared/hooks/useDataFetching';
import { getOrders } from '@/shared/api';
import type { OrderStatus } from '@/entities/order';
import Spinner from '@/shared/ui/Spinner';

const AdminOrdersPage = () => {
  const { data: orders, isLoading, error } = useDataFetching(getOrders);

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'Новый';
      case 'processing':
        return 'В обработке';
      case 'shipping':
        return 'Доставляется';
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
        return 'bg-success-subtle text-success';
      case 'cancelled':
        return 'bg-danger-subtle text-danger';
      default:
        return 'bg-warning-subtle text-warning-text';
    }
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
        <h2 className='text-2xl font-bold'>Ошибка при загрузке заказов</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className='mb-4 text-2xl font-bold text-text-default'>Заказы</h1>
      <div className='my-6 overflow-x-auto rounded bg-background-default shadow-md'>
        {/* Desktop Table */}
        <table className='hidden min-w-full table-auto md:table'>
          <thead>
            <tr className='text-text-muted bg-background-muted text-sm uppercase leading-normal'>
              <th className='px-6 py-3 text-left'>ID Заказа</th>
              <th className='px-6 py-3 text-left'>Дата</th>
              <th className='px-6 py-3 text-center'>Статус</th>
              <th className='px-6 py-3 text-left'>Состав</th>
              <th className='px-6 py-3 text-center'>Сумма</th>
              <th className='px-6 py-3 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light text-text-muted'>
            {(orders || []).map((order) => (
              <tr
                key={order.id}
                className='border-b border-border-default hover:bg-background-muted-hover'
              >
                <td className='whitespace-nowrap px-6 py-3 text-left text-text-default'>
                  {order.id}
                </td>
                <td className='px-6 py-3 text-left text-text-default'>
                  {new Date(order.date).toLocaleDateString()}
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
                  <div className='flex items-center justify-center space-x-2'>
                    {order.status === 'new' && (
                      <button className='rounded-md bg-success-subtle px-2 py-1 text-xs text-success-emphasis'>
                        Подтвердить
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className='rounded-md bg-primary-subtle px-2 py-1 text-xs text-primary'>
                        Отгрузить
                      </button>
                    )}
                    {order.status !== 'completed' &&
                      order.status !== 'cancelled' && (
                        <button className='rounded-md bg-danger-subtle px-2 py-1 text-xs text-danger-emphasis'>
                          Отменить
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className='md:hidden'>
          {(orders || []).map((order) => (
            <div key={order.id} className='border-b border-border-default p-4'>
              <div className='mb-2 flex items-start justify-between'>
                <div>
                  <h3 className='font-bold text-text-default'>{order.id}</h3>
                  <p className='text-sm'>
                    {new Date(order.date).toLocaleDateString()}
                  </p>
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
                    <li key={item.product.id}>
                      {item.product.name} ({item.quantity} x {item.price} ₽)
                    </li>
                  ))}
                </ul>
              </div>
              <p className='mt-2 text-right font-bold text-text-default'>
                Итого: {order.total.toFixed(2)} ₽
              </p>
              <div className='mt-4 flex items-center justify-end space-x-2'>
                {order.status === 'new' && (
                  <button className='rounded-md bg-success-subtle px-2 py-1 text-xs text-success-emphasis'>
                    Подтвердить
                  </button>
                )}
                {order.status === 'processing' && (
                  <button className='rounded-md bg-primary-subtle px-2 py-1 text-xs text-primary'>
                    Отгрузить
                  </button>
                )}
                {order.status !== 'completed' &&
                  order.status !== 'cancelled' && (
                    <button className='rounded-md bg-danger-subtle px-2 py-1 text-xs text-danger-emphasis'>
                      Отменить
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
