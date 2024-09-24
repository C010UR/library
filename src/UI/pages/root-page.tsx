import { redirect, useLoaderData } from 'react-router-dom';
import { User } from '@/types/types';
import { getProfile } from '@/api/auth';

export async function profileLoader() {
  const user = await getProfile(false);

  if (user === undefined || user.error) {
    return redirect('/auth/login');
  }

  return { user };
}

export default function RootPage() {
  const { user } = useLoaderData() as { user: undefined | User };

  if (user === undefined) {
    redirect('/');
  }

  return <div>Hello</div>;
}
