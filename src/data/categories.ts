import type { Category } from '@/entities/category/model';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Лекарства и БАДы',
    subcategories: [
      { id: '1', name: 'Противопростудные и от гриппа', categoryId: '1' },
      { id: '2', name: 'Обезболивающие', categoryId: '1' },
      { id: '3', name: 'Для пищеварения', categoryId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Витамины и гигиена',
    subcategories: [
      { id: '1', name: 'Витамины для взрослых', categoryId: '2' },
      { id: '2', name: 'Средства для умывания', categoryId: '2' },
    ],
  },
];
