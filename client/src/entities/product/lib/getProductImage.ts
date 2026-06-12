import { BASE_URL } from '@/shared/config/constants';
import type { SyntheticEvent } from 'react';

export const PRODUCT_IMAGE_PLACEHOLDER = `${BASE_URL}assets/images/products/product-placeholder.svg`;

/**
 * Генерирует публичный путь к изображению товара.
 * @param source - Имя файла, абсолютный URL или публичный путь изображения.
 * @returns - Публичный URL изображения товара.
 */
export const getProductImage = (source?: string | null): string => {
  const imageSource = source?.trim();

  if (!imageSource) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  if (/^(https?:)?\/\//.test(imageSource) || /^(data|blob):/.test(imageSource)) {
    return imageSource;
  }

  if (imageSource.startsWith('/')) {
    return imageSource;
  }

  if (imageSource.startsWith('assets/') || imageSource.startsWith('storage/')) {
    return `/${imageSource}`;
  }

  return `${BASE_URL}assets/images/products/${imageSource}`;
};

export const handleProductImageError = (
  event: SyntheticEvent<HTMLImageElement>
): void => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = PRODUCT_IMAGE_PLACEHOLDER;
};
