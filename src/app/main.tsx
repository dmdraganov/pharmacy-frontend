import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers';
import AppRouter from './AppRouter.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <AppRouter />
  </AppProvider>
);
