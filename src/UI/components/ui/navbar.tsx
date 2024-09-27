import React from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '@/components/providers/user/use-user';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Profile from '@/components/ui/profile';
import ThemeToggle from '@/components/ui/theme-toggle';
import { NavbarLink } from '@/types/types';
import { Dot } from 'lucide-react';

export interface NavbarProps {
  navItems: NavbarLink[];
}

function Navbar({ navItems }: NavbarProps) {
  const user = useUser();

  return (
    <nav className="absolute w-full flex items-center justify-between p-4 shadow-lg backdrop-blur transition-colors duration-200 border-b bg-muted">
      <div className="flex items-center space-x-8">
        <Link className="flex items-center space-x-2" to="/">
          <img src="/favicon.svg" alt="Logo" className="h-10" />
        </Link>

        <Breadcrumb separator={<Dot />}>
          <BreadcrumbList>
            {navItems.map((navItem: NavbarLink, idx: number) => (
              <React.Fragment key={idx}>
                {!!idx && <BreadcrumbSeparator />}
                <BreadcrumbItem key={`link=${idx}`}>
                  <BreadcrumbLink to={navItem.link}>
                    {navItem.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Profile user={user} />
      </div>
    </nav>
  );
}

export { Navbar };
