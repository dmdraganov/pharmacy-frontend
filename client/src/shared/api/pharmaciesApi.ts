import { pharmacies } from './mocks/pharmacies';
import type { Pharmacy } from '@/entities/pharmacy';

/**
 * Имитирует задержку сети
 * @param delay - время задержки в мс
 */
const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Получить список аптек для самовывоза
 */
export const getPharmacies = async (): Promise<Pharmacy[]> => {
  await sleep();
  return Promise.resolve(pharmacies);
};
