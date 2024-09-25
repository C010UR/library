import { Outlet } from 'react-router-dom';

import ThemeToggle from '@/components/ui/theme-toggle';

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <ThemeToggle />
      <Outlet />
    </div>
  );
}
