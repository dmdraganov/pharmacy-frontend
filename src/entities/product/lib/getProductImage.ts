import { BASE_URL } from '@/shared/config/constants';

/**
 * Генерирует публичный путь к изображению товара.
 * @param filename - Имя файла изображения (e.g., 'theraflu.webp')
 * @returns - Публичный URL (e.g., '/images/products/theraflu.webp')
 */
export const getProductImage = (filename: string): string => {
  return `${BASE_URL}assets/images/products/${filename}`;
};
