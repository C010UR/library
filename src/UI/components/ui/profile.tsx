import { cva, type VariantProps } from 'class-variance-authority';
import { LogOut, User as UserIcon } from 'lucide-react';

import { useLogout } from '@/components/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types/types';
import { useNavigate } from 'react-router-dom';

const profileVariants = cva('', {
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

export interface ProfileProps extends VariantProps<typeof profileVariants> {
  user: User;
}

export default function Profile({ user, size }: ProfileProps) {
  const mutation = useLogout();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={profileVariants({
            size,
            className: 'rounded-full',
          })}
        >
          <Avatar className={profileVariants({ size })}>
            <AvatarImage alt="User Avatar" src={user.image ?? undefined} />
            <AvatarFallback>
              {user.firstname[0] ?? 'N'}
              {user.lastname[0] ?? 'A'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-row space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage alt="User Avatar" src={user.image ?? undefined} />
              <AvatarFallback>
                {user.firstname[0] ?? 'N'}
                {user.lastname[0] ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.full_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={mutation.isPending}
          onClick={() => navigate('/user/' + user.slug)}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
