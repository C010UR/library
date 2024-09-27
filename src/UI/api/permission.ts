import {
  backendFetch,
  backendQueryClient,
  ParamsOptions,
} from '@/lib/backend-fetch';
import { PaginatedResult, Permission, User } from '@/types/types';

export async function getPermissionList(params: ParamsOptions = {}) {
  return backendQueryClient.fetchQuery({
    queryKey: ['permissions', params],
    queryFn: () =>
      backendFetch<PaginatedResult<User>, undefined>('/permissions/list', {
        params,
      }),
  });
}

export async function getPermissionByName(name: string) {
  return backendQueryClient.fetchQuery({
    queryKey: ['permission', name],
    queryFn: () =>
      backendFetch<Permission, undefined>('/permission/name/' + name),
  });
}
