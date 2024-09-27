import { Link } from 'react-router-dom';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { isURL } from '@/lib/utils.ts';
import type { User } from '@/types/types';
import { Permission } from '@/types/types';
import React from 'react';
import { Separator } from '@/components/ui/separator.tsx';

export default function UserEntity({
  user,
  showStatuses = true,
  showPermissions = true,
  showContactInformation = true,
  showImage = true,
  actions = undefined,
}: {
  user: User;
  actions?: React.ReactNode | React.JSX.Element;
  showStatuses?: boolean;
  showPermissions?: boolean;
  showContactInformation?: boolean;
  showImage?: boolean;
}) {
  console.log(user.contact_information);

  return (
    <Card className="w-full mx-auto bg-background/30">
      <CardHeader className="flex flex-row w-full justify-between">
        <div className="flex flex-row items-center space-x-4">
          {showImage && (
            <Avatar className="w-20 h-20">
              <AvatarImage alt={user.full_name} src={user.image || undefined} />
              <AvatarFallback>
                {user.firstname[0] ?? 'N'}
                {user.lastname[0] ?? 'A'}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <CardTitle className="text-2xl">{user.full_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">{actions}</div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Separator />
          {showContactInformation && (
            <section>
              <h3 className="text-lg font-semibold mb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
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
          )}

          {showStatuses && (
            <section>
              <h3 className="text-lg font-semibold mb-2">Account Status</h3>
              <div className="flex gap-2">
                <Badge variant={user.is_active ? 'success' : 'error'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant={user.is_disabled ? 'error' : 'success'}>
                  {user.is_disabled ? 'Disabled' : 'Enabled'}
                </Badge>
              </div>
            </section>
          )}

          {showPermissions && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
