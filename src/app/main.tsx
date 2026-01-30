import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers';
import AppRouter from './AppRouter.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </StrictMode>
);
