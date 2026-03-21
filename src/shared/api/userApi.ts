import { user } from './mocks/user';
import type { User } from '@/entities/user';

/**
 * Имитирует задержку сети
 * @param delay - время задержки в мс
 */
const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Получить данные пользователя
 */
export const getUser = async (): Promise<User> => {
  await sleep();
  return Promise.resolve(user);
};
