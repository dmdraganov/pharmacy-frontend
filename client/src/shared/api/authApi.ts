import { users as mockUsers } from './mocks/users';
import type { User } from '@/entities/user';

// In-memory user database. In a real app, this would be an API call.
const users = [...mockUsers];

/**
 * Имитирует задержку сети
 * @param delay - время задержки в мс
 */
const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const login = async (email: string, password: string): Promise<User> => {
  await sleep();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const register = async (
  userData: Omit<User, 'id' | 'role'>
): Promise<User> => {
  await sleep();
  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser: User = {
    id: String(users.length + 1),
    role: 'USER',
    ...userData,
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const getMe = async (userId: string): Promise<User | null> => {
  await sleep();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return null;
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
