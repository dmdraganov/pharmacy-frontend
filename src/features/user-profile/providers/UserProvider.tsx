import { useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { UserContext } from '../context';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { User } from '@/entities/user';
import { user as initialUser } from '@/data/user';
import { STORAGE_KEYS } from '@/shared/config/constants';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User>(
    STORAGE_KEYS.USER_PROFILE,
    initialUser
  );

  const updateUser = useCallback(
    (newUserData: Partial<User>) => {
      setUser((prevUser) => ({
        ...prevUser,
        ...newUserData,
      }));
    },
    [setUser]
  );

  const value = useMemo(
    () => ({
      user,
      updateUser,
    }),
    [user, updateUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
