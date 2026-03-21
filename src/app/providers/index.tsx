import { BrowserRouter } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE || undefined}>
      {children}
    </BrowserRouter>
  );
};

