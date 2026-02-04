import { orders } from '@/data/orders';
import type { OrderStatus } from '@/entities/order';

const AdminOrdersPage = () => {
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

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4 text-text-heading'>Заказы</h1>
      <div className='bg-background-default shadow-md rounded my-6 overflow-x-auto'>
        {/* Desktop Table */}
        <table className='min-w-full table-auto hidden md:table'>
          <thead>
            <tr className='bg-background-muted text-text-muted uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>ID Заказа</th>
              <th className='py-3 px-6 text-left'>Дата</th>
              <th className='py-3 px-6 text-center'>Статус</th>
              <th className='py-3 px-6 text-left'>Состав</th>
              <th className='py-3 px-6 text-center'>Сумма</th>
              <th className='py-3 px-6 text-center'>Действия</th>
            </tr>
          </thead>
          <tbody className='text-text-muted text-sm font-light'>
            {orders.map((order) => (
              <tr
                key={order.id}
                className='border-b border-border-default hover:bg-background-hover'
              >
                <td className='py-3 px-6 text-left whitespace-nowrap text-text-default'>
                  {order.id}
                </td>
                <td className='py-3 px-6 text-left text-text-default'>
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className='py-3 px-6 text-center'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className='py-3 px-6 text-left text-text-default'>
                  <ul className='list-disc list-inside'>
                    {order.items.map((item) => (
                      <li key={item.product.id}>
                        {item.product.name} ({item.quantity} x {item.price} ₽)
                      </li>
                    ))}
                  </ul>
                </td>
                <td className='py-3 px-6 text-center font-semibold text-text-default'>
                  {order.total.toFixed(2)} ₽
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex items-center justify-center space-x-2'>
                    {order.status === 'new' && (
                      <button className='py-1 px-2 text-xs rounded-md bg-success-subtle text-success-emphasis'>
                        Подтвердить
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className='py-1 px-2 text-xs rounded-md bg-primary-subtle text-primary-emphasis'>
                        Отгрузить
                      </button>
                    )}
                    {order.status !== 'completed' &&
                      order.status !== 'cancelled' && (
                        <button className='py-1 px-2 text-xs rounded-md bg-danger-subtle text-danger-emphasis'>
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
          {orders.map((order) => (
            <div key={order.id} className='p-4 border-b border-border-default'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h3 className='font-bold text-text-default'>{order.id}</h3>
                  <p className='text-sm'>
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div>
                <h4 className='font-semibold text-text-default'>Состав:</h4>
                <ul className='list-disc list-inside pl-2 text-sm'>
                  {order.items.map((item) => (
                    <li key={item.product.id}>
                      {item.product.name} ({item.quantity} x {item.price} ₽)
                    </li>
                  ))}
                </ul>
              </div>
              <p className='font-bold text-right mt-2 text-text-default'>
                Итого: {order.total.toFixed(2)} ₽
              </p>
              <div className='flex items-center justify-end space-x-2 mt-4'>
                {order.status === 'new' && (
                  <button className='py-1 px-2 text-xs rounded-md bg-success-subtle text-success-emphasis'>
                    Подтвердить
                  </button>
                )}
                {order.status === 'processing' && (
                  <button className='py-1 px-2 text-xs rounded-md bg-primary-subtle text-primary-emphasis'>
                    Отгрузить
                  </button>
                )}
                {order.status !== 'completed' &&
                  order.status !== 'cancelled' && (
                    <button className='py-1 px-2 text-xs rounded-md bg-danger-subtle text-danger-emphasis'>
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
