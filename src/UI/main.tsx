import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import ThemeProvider from '@/components/providers/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { backendQueryClient } from '@/lib/backend-fetch';
import router from '@/router/router';

import '@/styles/index.css';
import '@/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={backendQueryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors={true} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
