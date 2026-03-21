import { products } from './mocks/products';
import type { Product } from '@/entities/product';

/**
 * Имитирует задержку сети
 * @param delay - время задержки в мс
 */
const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Получить все товары
 */
export const getProducts = async (): Promise<Product[]> => {
  await sleep();
  return Promise.resolve(products);
};

/**
 * Получить товар по его ID
 * @param id - ID товара
 */
export const getProductById = async (
  id: string,
): Promise<Product | undefined> => {
  await sleep();
  return Promise.resolve(products.find((p) => p.id === id));
};
