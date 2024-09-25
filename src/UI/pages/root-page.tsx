import { redirect, useLoaderData } from 'react-router-dom';

import { getProfile } from '@/api/auth';
import UserProvider from '@/components/providers/user/user-provider';
import { User } from '@/types/types';

export async function profileLoader() {
  try {
    const user = await getProfile();

    if (!user) {
      return redirect('/auth/login');
    }

    return { user };
  } catch (_) {}

  return { user: null };
}

export default function RootPage() {
  const { user } = useLoaderData() as { user: User };

  return (
    <>
      <UserProvider value={user}>
        <div>{user.email}</div>
      </UserProvider>
    </>
  );
}
