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
      <div className='bg-background-default shadow-md rounded my-6'>
        <table className='min-w-full table-auto'>
          <thead>
            <tr className='bg-background-muted text-text-muted uppercase text-sm leading-normal'>
              <th className='py-3 px-6 text-left'>ID Заказа</th>
              <th className='py-3 px-6 text-left'>Дата</th>
              <th className='py-3 px-6 text-center'>Статус</th>
              <th className='py-3 px-6 text-left'>Состав</th>
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
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.product.id}>
                        {item.product.name} ({item.quantity} x {item.price} ₽)
                      </li>
                    ))}
                  </ul>
                </td>
                <td className='py-3 px-6 text-center'>
                  <div className='flex items-center justify-center'>
                    {order.status === 'new' && (
                      <button className='bg-success hover:bg-success-hover text-text-on-primary text-xs font-bold py-1 px-2 rounded mr-2'>
                        Подтвердить
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className='bg-primary hover:bg-primary-hover text-text-on-primary text-xs font-bold py-1 px-2 rounded mr-2'>
                        Отгрузить
                      </button>
                    )}
                    {order.status !== 'completed' &&
                      order.status !== 'cancelled' && (
                        <button className='bg-danger hover:bg-danger-hover text-text-on-danger text-xs font-bold py-1 px-2 rounded'>
                          Отменить
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
