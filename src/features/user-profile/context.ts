import { createContext } from 'react';
import type { User } from '@/entities/user';

interface UserContextValue {
  user: User;
  updateUser: (newUserData: Partial<User>) => void;
}

export const UserContext = createContext<UserContextValue | undefined>(
  undefined
);
