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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Заказы</h1>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID Заказа</th>
              <th className="py-3 px-6 text-left">Дата</th>
              <th className="py-3 px-6 text-center">Статус</th>
              <th className="py-3 px-6 text-left">Состав</th>
              <th className="py-3 px-6 text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {order.id}
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed'
                        ? 'bg-green-200 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.product.id}>
                        {item.product.name} ({item.quantity} x {item.price} ₽)
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    {order.status === 'new' && (
                      <button className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded mr-2">
                        Подтвердить
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded mr-2">
                        Отгрузить
                      </button>
                    )}
                    {order.status !== 'completed' &&
                      order.status !== 'cancelled' && (
                        <button className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded">
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