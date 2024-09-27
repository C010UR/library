import {
  ToggleLeft,
  ToggleRight,
  TrashIcon,
  User as UserIcon,
} from 'lucide-react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { userHasAccess } from '@/api/auth';
import { getUserBySlug } from '@/api/user';
import { useDeleteUser } from '@/components/hooks/use-user';
import { Button } from '@/components/ui/button';
import { SimpleAlertDialog } from '@/components/ui/simple-alert-dialog';
import { isGranted } from '@/lib/utils';
import { User } from '@/types/types';
import UserEntity from '@/components/ui/entity/user-entity.tsx';

export async function userShowLoader({ params }: { params: unknown }) {
  const slug = (params as { slug: undefined | string }).slug ?? '0';

  await userHasAccess(['SHOW_USERS'], slug);
  const user = await getUserBySlug(slug);

  return { user };
}

export default function ShowUserPage() {
  const { user } = useLoaderData() as { user: User };
  const navigate = useNavigate();

  const deleteUserMutation = useDeleteUser(user);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <UserEntity
        user={user}
        actions={
          <>
            <Button
              size="sm"
              onClick={() => navigate('/user/' + user.slug + '/update')}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Update</span>
            </Button>
            <SimpleAlertDialog
              title={'Are you absolutely sure?'}
              description={`This action cannot be undone. This will permanently delete the ${user.full_name} and remove it from our servers.`}
              action="Delete"
              onAction={() => deleteUserMutation.mutate()}
            >
              <Button size="sm" variant="error">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </SimpleAlertDialog>
            {isGranted(user, 'UPDATE_USERS') && (
              <SimpleAlertDialog
                title={'Are you absolutely sure?'}
                description={`This will ${user.is_disabled ? 'Enable' : 'Disable'} the ${user.full_name}.`}
                action="Delete"
                onAction={() => deleteUserMutation.mutate()}
              >
                <Button
                  size="sm"
                  variant={user.is_disabled ? 'default' : 'error'}
                >
                  {user.is_disabled ? (
                    <ToggleLeft className="h-4 w-4 mr-2" />
                  ) : (
                    <ToggleRight className="h-4 w-4 mr-2" />
                  )}
                  {user.is_disabled ? 'Enable' : 'Disable'}
                </Button>
              </SimpleAlertDialog>
            )}
          </>
        }
      />
    </div>
  );
}
