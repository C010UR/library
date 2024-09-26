import {Outlet, redirect, useLoaderData} from 'react-router-dom';

import { getProfile } from '@/api/auth';
import UserProvider from '@/components/providers/user/user-provider';
import { NavbarLink, User } from '@/types/types';
import { FloatingNav } from '@/components/ui/floating-navbar.tsx';
import { House, Send, User as UserIcon } from 'lucide-react';
import Navbar from '@/components/ui/navbar.tsx';

export async function profileLoader() {
  try {
    const user = await getProfile();

    if (!user) {
      return redirect('/auth/login');
    }

    return { user };
  } catch (_) {
    return redirect('/auth/login');
  }
}

export default function RootPage() {
  const { user } = useLoaderData() as { user: User };

  const navItems: NavbarLink[] = [
    {
      name: 'Home',
      link: '/',
      icon: <House className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: 'About',
      link: '/about',
      icon: <UserIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: 'Contact',
      link: '/contact',
      icon: <Send className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <>
      <UserProvider value={user}>
        <Navbar navItems={navItems}/>
        <FloatingNav navItems={navItems}/>
        <div className="h-screen pt-20">
          <Outlet/>
        </div>
      </UserProvider>
    </>
  );
}
