import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button.tsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {useState} from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input type={showPassword ? 'text' : 'password'} ref={ref} {...props} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={props.disabled}
          className="absolute right-0 top-1/2 -translate-y-1/2"
          noAnimation={true}
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

PasswordInput.displayName = 'PasswordInput'

export { Input, PasswordInput };
