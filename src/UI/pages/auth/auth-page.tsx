import { Outlet } from 'react-router-dom';

import ThemeToggle from '@/components/ui/theme-toggle';

export default function AuthPage() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-muted dark:bg-background">
        <Outlet />
      </div>
    </>
  );
}
