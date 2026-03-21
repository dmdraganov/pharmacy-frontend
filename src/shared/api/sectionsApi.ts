import { sections } from '@/data/sections';
import type { Section, Category } from '@/entities/section/types';

/**
 * Имитирует задержку сети
 * @param delay - время задержки в мс
 */
const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

/**
 * Получить все секции с категориями
 */
export const getSections = async (): Promise<Section[]> => {
  await sleep();
  return Promise.resolve(sections);
};

/**
 * Получить все категории
 */
export const getCategories = async (): Promise<Category[]> => {
  await sleep();
  const allCategories = sections.flatMap((section) => section.categories);
  return Promise.resolve(allCategories);
};

/**
 * Получить секцию по ее ID
 * @param id - ID секции
 */
export const getSectionById = async (
  id: string,
): Promise<Section | undefined> => {
  await sleep();
  return Promise.resolve(sections.find((s) => s.id === id));
};
