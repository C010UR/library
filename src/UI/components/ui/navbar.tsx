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

export default function Navbar({ navItems }: { navItems: NavbarLink[] }) {
  const user = useUser();

  return (
    <nav className="absolute w-screen flex items-center justify-between p-4 bg-background/30 shadow-lg backdrop-blur transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <Link className="flex items-center space-x-2" to="/">
          <img src="/favicon.svg" alt="Logo" className="h-10" />
        </Link>

        <Breadcrumb separator={<Dot />}>
          <BreadcrumbList>
            {navItems.map((navItem: NavbarLink, idx: number) => (
                <React.Fragment key={idx}>
                  {!!idx && <BreadcrumbSeparator />}
                  <BreadcrumbItem key={`link=${idx}`}>
                    <BreadcrumbLink href={navItem.link}>
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
