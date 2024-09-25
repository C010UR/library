import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import {useState} from "react";

import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input ref={ref} type={showPassword ? 'text' : 'password'} {...props} />
        <Button
          className="absolute right-0 top-1/2 -translate-y-1/2"
          disabled={props.disabled}
          size="icon"
          type="button"
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle password visibility</span>
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export { Input, PasswordInput };
