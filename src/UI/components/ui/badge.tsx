import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        error:
          'border-transparent bg-error text-error-foreground hover:bg-error/80',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning:
          'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/80',
          'error-muted':
              'border-errormuted-border bg-errormuted text-errormuted-foreground hover:bg-mutederror/80',
          'success-muted':
              'border-successmuted-border bg-successmuted text-successmuted-foreground hover:bg-mutedsuccess/80',
          'warning-muted':
              'border-warningmuted-border bg-warningmuted text-warningmuted-foreground hover:bg-mutedwarning/80',
          'info-muted': 'border-infomuted-border bg-infomuted text-infomuted-foreground hover:bg-mutedinfo/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
