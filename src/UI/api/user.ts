import { UpdateUserForm } from '@/components/forms/update-user-form.tsx';
import {
  backendFetch,
  backendQueryClient,
  ParamsOptions,
} from '@/lib/backend-fetch';
import { PaginatedResult, User } from '@/types/types';

export async function getUserList(params: ParamsOptions = {}) {
  return backendQueryClient.fetchQuery({
    queryKey: ['users', params],
    queryFn: () =>
      backendFetch<PaginatedResult<User>, undefined>('/user/list', { params }),
  });
}

export async function getUserBySlug(slug: string) {
  return backendQueryClient.fetchQuery({
    queryKey: ['user', slug],
    queryFn: () => backendFetch<User, undefined>('/user/slug/' + slug),
  });
}

export async function getUserById(id: number) {
  return backendQueryClient.fetchQuery({
    queryKey: ['user', id],
    queryFn: () => backendFetch<User, undefined>('/user/' + id),
  });
}

export async function updateUser(user: User, data: UpdateUserForm) {
  if (typeof data.image === 'string') {
    delete data.image;
  }

  return backendQueryClient.fetchQuery({
    queryKey: ['user', user.id],
    staleTime: 0,
    queryFn: () =>
      backendFetch<User, UpdateUserForm>('/user/' + user.id + '/update', {
        method: 'POST',
        data,
        contentType: 'multipart/form-data',
      }),
  });
}

export async function deleteUser(user: User) {
  return backendQueryClient.fetchQuery({
    queryKey: ['user', user.id],
    staleTime: 0,
    queryFn: () =>
      backendFetch<User, UpdateUserForm>('/user/' + user.id + '/remove', {
        method: 'DELETE',
      }),
  });
}
