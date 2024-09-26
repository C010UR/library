import {
  ToggleLeft,
  ToggleRight,
  TrashIcon,
  User as UserIcon,
} from 'lucide-react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';

import { userHasAccess } from '@/api/auth';
import { getUserBySlug } from '@/api/user';
import { useDeleteUser } from '@/components/hooks/use-user.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isGranted, isURL } from '@/lib/utils';
import { Permission, User } from '@/types/types';
import { Button } from '@/components/ui/button.tsx';
import SimpleAlertDialog from '@/components/ui/simple-alert-dialog.tsx';

export async function userLoader({ params }: { params: unknown }) {
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
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto bg-background/30">
        <CardHeader className="flex flex-row w-full justify-between">
          <div className="flex flex-row items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage alt={user.full_name} src={user.image || undefined} />
              <AvatarFallback>
                {user.firstname[0] ?? 'N'}
                {user.lastname[0] ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.full_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
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
              <Button size="sm" variant="destructive">
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
                  variant={user.is_disabled ? 'default' : 'destructive'}
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {user.contact_information ? (
                  user.contact_information.map(
                    (
                      data: {
                        key: string | undefined;
                        value: string | undefined;
                      },
                      idx: number,
                    ) => (
                      <div key={idx} className="mb-2 p-2 rounded">
                        <div>
                          <p className="text-sm font-medium">
                            {data.key ?? 'N/A'}:
                          </p>

                          {user.contact_information &&
                          isURL(data.value ?? '') ? (
                            <a
                              className="text-sm text-muted-foreground hover:underline"
                              href={data.value}
                            >
                              {data.value}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {(data.value ?? false) ? data.value : 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No contact information available
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Account Status</h3>
              <div className="flex gap-2">
                <Badge variant={user.is_active ? 'default' : 'outline'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant={user.is_disabled ? 'destructive' : 'outline'}>
                  {user.is_disabled ? 'Disabled' : 'Enabled'}
                </Badge>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Permissions</h3>
              <div className="p-4 w-full rounded-md border flex flex-col">
                {user.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((permission: Permission<undefined>) => (
                    <div
                      key={permission.id}
                      className="mb-2 p-2 rounded hover:bg-muted"
                    >
                      <Link to={'/permission/' + permission.name}>
                        <h4 className="text-sm font-medium">
                          {permission.name}
                        </h4>

                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    User has no permissions.
                  </p>
                )}
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
