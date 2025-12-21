import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouter } from './core/routes/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './common/store';
import { Toaster } from 'sonner';
import { RuntimeConfigProvider, initializeRuntimeConfig } from './core/configs/runtime-config';
import { reinitializeHttpClients } from './common/utils/http';

const queryClient = new QueryClient();

// Initialize runtime config and HTTP clients before rendering
async function initializeApp() {
  await initializeRuntimeConfig();
  await reinitializeHttpClients();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RuntimeConfigProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
            <Toaster richColors closeButton position='top-center' />
          </QueryClientProvider>
        </Provider>
      </RuntimeConfigProvider>
    </StrictMode>,
  );
}

initializeApp();
