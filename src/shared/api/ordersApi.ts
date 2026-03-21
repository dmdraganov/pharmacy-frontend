import { orders } from '@/data/orders';
import type { Order } from '@/entities/order';

/**
 * Имитирует задержку сети
 * @param delay - время задержки в мс
 */
const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Получить историю заказов
 */
export const getOrders = async (): Promise<Order[]> => {
  await sleep();
  return Promise.resolve(orders);
};

/**
 * Получить заказ по его ID
 * @param id - ID заказа
 */
export const getOrderById = async (id: string): Promise<Order | undefined> => {
  await sleep();
  return Promise.resolve(orders.find((o) => o.id === id));
};
