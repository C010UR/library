import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from './button';

import { useTheme } from '@/components/providers/theme/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { cva, VariantProps } from 'class-variance-authority';

const themeVariants = cva('rounded-full p-0', {
  variants: {
    size: {
      default: 'h-10 w-10',
      sm: 'h-8 w-8',
      lg: 'h-12 w-12',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface ThemeProps extends VariantProps<typeof themeVariants> {}

export default function ThemeToggle({ size }: ThemeProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={themeVariants({ size })}>
          <SunIcon  className="h-[1.2rem] w-[1.2rem] block dark:hidden" />
          <MoonIcon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => theme.setTheme('light')}>
          <SunIcon className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.setTheme('dark')}>
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => theme.setTheme('system')}>
          <SunMoonIcon className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
