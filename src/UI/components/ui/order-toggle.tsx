import type { VariantProps } from 'class-variance-authority';
import { ArrowDownAz, ArrowUpDown, ArrowUpZa } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';

export interface OrderToggleProps extends VariantProps<typeof Button> {
  state: 'ASC' | 'DESC' | undefined | null;
  name: string;
  onChange: () => unknown;
}

function OrderToggle({ state, name, onChange, ...props }: OrderToggleProps) {
  let Icon = ArrowUpDown;

  switch (state) {
    case 'ASC':
      Icon = ArrowDownAz;
      break;
    case 'DESC':
      Icon = ArrowUpZa;
      break;
  }

  return (
    <Button
      className="hover:bg-transparent"
      variant="ghost"
      onClick={onChange}
      {...props}
    >
      {name}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}

export { OrderToggle };
