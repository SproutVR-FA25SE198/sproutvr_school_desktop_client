import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './core/routes/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './common/store';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster richColors closeButton position="top-center" />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
