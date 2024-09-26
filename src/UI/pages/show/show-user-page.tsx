import { Link, useLoaderData } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission, User } from '@/types/types';
import { getUserBySlug } from '@/api/user';

export async function userLoader({
  params,
}: {
  params: unknown;
}) {
  const user = await getUserBySlug((params as { slug: undefined | string }).slug ?? '0');
  return { user };
}

export default function ShowUserPage() {
  const { user } = useLoaderData() as { user: User };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-3xl mx-auto bg-background/30">
        <CardHeader className="flex flex-row items-center gap-4">
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
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">First Name:</p>
                  <p className="text-sm text-muted-foreground">
                    {user.firstname}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Name:</p>
                  <p className="text-sm text-muted-foreground">
                    {user.lastname}
                  </p>
                </div>
                {user.middlename && (
                  <div>
                    <p className="text-sm font-medium">Middle Name:</p>
                    <p className="text-sm text-muted-foreground">
                      {user.middlename}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              {user.contact_information ? (
                <pre className="text-sm bg-muted p-2 rounded-md overflow-x-auto">
                  {JSON.stringify(user.contact_information, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No contact information available
                </p>
              )}
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Account Status</h3>
              <div className="flex gap-2">
                <Badge variant={user.is_active ? 'default' : 'secondary'}>
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
