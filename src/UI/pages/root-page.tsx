import { redirect, useLoaderData } from 'react-router-dom';

import { getProfile } from '@/api/auth';
import { User } from '@/types/types';

export async function profileLoader() {
  try {
    const user = await getProfile();

    if (user !== undefined) {
      return redirect('/');
    }

    return { user };
  } catch (_) {}

  return { user: null };
}

export default function RootPage() {
  const { user } = useLoaderData() as { user: undefined | User };

  if (user === undefined) {
    redirect('/');
  }

  return <div>Hello</div>;
}
