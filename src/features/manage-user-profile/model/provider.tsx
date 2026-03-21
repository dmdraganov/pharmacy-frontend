import { useMemo, useCallback, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserContext } from './context';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { User } from '@/entities/user';
import { getUser } from '@/shared/api';
import { STORAGE_KEYS } from '@/shared/config/constants';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [initialUser, setInitialUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialUser = async () => {
      try {
        const user = await getUser();
        setInitialUser(user);
      } catch (error) {
        console.error('Failed to fetch initial user:', error);
        // Set a fallback user object if fetch fails to prevent crash
        setInitialUser({
          firstName: 'Guest',
          lastName: '',
          phone: '',
          email: '',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialUser();
  }, []);

  const [user, setUser] = useLocalStorage<User | null>(
    STORAGE_KEYS.USER_PROFILE,
    initialUser,
  );

  useEffect(() => {
    // When initialUser is loaded, set it to localStorage if it's not already there
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  const updateUser = useCallback(
    (newUserData: Partial<User>) => {
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...newUserData } : null,
      );
    },
    [setUser],
  );

  const value = useMemo(
    () => ({
      user: user || initialUser, // Provide a non-null user object
      updateUser,
      isLoading,
    }),
    [user, updateUser, isLoading, initialUser],
  );

  // Potentially show a global spinner or render children only when not loading
  if (isLoading && !user) {
    // Or a full-page spinner if this context is critical for the whole app
    return null;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
