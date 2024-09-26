import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OneOrMany, Permission, User, UserPermission } from '@/types/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isURL(str: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
}

export function isGranted(
  user: User,
  permission: OneOrMany<UserPermission>,
): boolean {
  if (user.permissions === undefined || user.permissions.length === 0) {
    return false;
  }

  const findPermission = (targetPermission: UserPermission) =>
    user.permissions.find(
      (permission: Permission<undefined>) =>
        permission.name === targetPermission,
    );

  if (Array.isArray(permission)) {
    for (const _permission of permission) {
      if (!findPermission(_permission)) {
        return false;
      }
    }
  } else {
    if (!findPermission(permission)) {
      return false;
    }
  }

  return true;
}
