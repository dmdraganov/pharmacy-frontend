import type { Pharmacy } from '@/entities/pharmacy';

export const pharmacies: Pharmacy[] = [
  {
    id: 'ph-1',
    name: 'Аптека №1 "Здоровье"',
    address: 'г. Москва, ул. Ленина, д. 10',
    workingHours: '08:00 - 22:00',
  },
  {
    id: 'ph-2',
    name: 'Фарма-сеть "Пульс"',
    address: 'г. Москва, ул. Центральная, д. 45',
    workingHours: '09:00 - 21:00',
  },
  {
    id: 'ph-3',
    name: 'Городская аптека №12',
    address: 'г. Москва, пр. Мира, д. 112',
    workingHours: '24/7',
  },
];
