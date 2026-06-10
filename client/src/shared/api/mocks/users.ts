import type { User } from '@/entities/user';

export const users: User[] = [
  {
    id: '1',
    role: 'ADMIN',
    firstName: 'Иван',
    lastName: 'Петров',
    phone: '+7 (999) 123-45-67',
    email: 'admin@example.com',
    password: 'password123',
  },
  {
    id: '2',
    role: 'USER',
    firstName: 'Мария',
    lastName: 'Сидорова',
    phone: '+7 (999) 765-43-21',
    email: 'user@example.com',
    password: 'password123',
  },
];
