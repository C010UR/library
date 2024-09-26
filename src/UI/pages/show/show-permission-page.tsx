import { Link, useLoaderData } from 'react-router-dom';

import { getPermissionByName } from '@/api/permission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission, User } from '@/types/types';
import { userHasAccess } from '@/api/auth.ts';

export async function permissionLoader({ params }: { params: unknown }) {
  await userHasAccess(['SHOW_PERMISSIONS']);
  const permission = await getPermissionByName(
    (params as { name: undefined | string }).name ?? '0',
  );
  return { permission };
}

export default function ShowPermissionPage() {
  const { permission } = useLoaderData() as { permission: Permission };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto bg-background/30">
        <CardHeader className="flex flex-row items-center gap-4">
          <div>
            <CardTitle className="text-2xl">{permission.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {permission.description}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">Users</h3>
              <div className="p-4 w-full rounded-md border flex flex-col">
                {permission.users && permission.users.length > 0 ? (
                  permission.users.map((user: User<undefined>) => (
                    <div
                      key={user.id}
                      className="mb-2 p-2 rounded hover:bg-muted"
                    >
                      <Link to={'/user/' + user.slug}>
                        <h4 className="text-sm font-medium">
                          {user.full_name}
                        </h4>

                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No users have this permission.
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
