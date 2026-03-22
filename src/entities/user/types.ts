export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
}
