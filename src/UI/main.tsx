import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from '@/router/router';

import '@/styles/index.css';
import '@/styles/globals.css';
import ThemeProvider from '@/components/providers/theme/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors={true} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
