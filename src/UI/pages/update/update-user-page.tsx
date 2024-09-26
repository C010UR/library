import { useLoaderData } from 'react-router-dom';

import { userHasAccess } from '@/api/auth';
import { getUserBySlug } from '@/api/user';
import UpdateUserForm from '@/components/forms/update-user-form.tsx';
import { useUpdateUser } from '@/components/hooks/use-user.tsx';
import { User } from '@/types/types';

export async function updateUserLoader({ params }: { params: unknown }) {
  const slug = (params as { slug: undefined | string }).slug ?? '0';

  await userHasAccess(['SHOW_USERS', 'UPDATE_USERS'], slug);
  const user = await getUserBySlug(slug);
  return { user };
}

export default function UpdateUserPage() {
  const { user } = useLoaderData() as { user: User };

  const mutation = useUpdateUser(user);

  return (
    <div className="container mx-auto p-6">
      <UpdateUserForm user={user} onSubmit={(data) => mutation.mutate(data)} />
    </div>
  );
}
