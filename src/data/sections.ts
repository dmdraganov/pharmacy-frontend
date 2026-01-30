import type { Section } from '@/entities/section/model';

export const sections: Section[] = [
  {
    id: 'medicines',
    name: 'Лекарственные средства',
    categories: [
      {
        id: 'painkillers',
        name: 'Обезболивающие',
        sectionId: 'medicines',
      },
      {
        id: 'cold',
        name: 'Простуда и грипп',
        sectionId: 'medicines',
      },
      {
        id: 'digestive',
        name: 'Пищеварение',
        sectionId: 'medicines',
      },
      {
        id: 'allergy',
        name: 'Аллергия',
        sectionId: 'medicines',
      },
      {
        id: 'heart',
        name: 'Сердечно-сосудистые',
        sectionId: 'medicines',
      },
      {
        id: 'vitamins',
        name: 'Витамины и БАД',
        sectionId: 'medicines',
      },
    ],
  },
  {
    id: 'medical-devices',
    name: 'Медицинские изделия',
    categories: [
      {
        id: 'thermometers',
        name: 'Термометры',
        sectionId: 'medical-devices',
      },
      {
        id: 'bandages',
        name: 'Перевязочные материалы',
        sectionId: 'medical-devices',
      },
      {
        id: 'diagnostics',
        name: 'Диагностические приборы',
        sectionId: 'medical-devices',
      },
    ],
  },
];
