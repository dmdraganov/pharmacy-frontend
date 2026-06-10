import {
  apiRequest,
  clearAuthToken,
  setAuthToken,
  type ApiEnvelope,
} from './apiClient';
import type { User, UserRole } from '@/entities/user';

interface ApiUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  phone?: string | null;
  roles?: Array<{ name?: string } | string>;
}

interface AuthResponse {
  user?: ApiUser;
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
}

const mapUser = (user: ApiUser): User => {
  const firstRole = user.roles?.[0];
  const role =
    typeof firstRole === 'string' ? firstRole : firstRole?.name || 'USER';

  return {
    id: user.id,
    role: role as UserRole,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    phone: user.phone || '',
    email: user.email,
  };
};

export const login = async (
  email: string,
  password: string
): Promise<User | null> => {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setAuthToken(response.data.token);
  return response.data.user ? mapUser(response.data.user) : getMe();
};

export const register = async (userData: RegisterPayload): Promise<User> => {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: {
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password,
    },
  });
  setAuthToken(response.data.token);
  return response.data.user ? mapUser(response.data.user) : getMe();
};

export const logout = async (): Promise<void> => {
  try {
    await apiRequest<void>('/auth/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
};

export const getMe = async (): Promise<User> => {
  const response = await apiRequest<ApiUser>('/auth/me');
  return mapUser(response.data);
};

export const updateProfile = async (
  data: Partial<User>
): Promise<User> => {
  const response: ApiEnvelope<ApiUser> = await apiRequest<ApiUser>(
    '/users/profile',
    {
      method: 'PATCH',
      body: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      },
    }
  );
  return mapUser(response.data);
};
