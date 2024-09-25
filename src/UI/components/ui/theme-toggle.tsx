import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from './button';

import { useTheme } from '@/components/providers/theme/use-theme';

export default function ThemeToggle() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4">
      <Button size="icon" variant="ghost" onClick={() => theme.toggleTheme()}>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
