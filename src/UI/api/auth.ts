import { backendFetch, backendQueryClient } from '@/lib/backend-fetch';
import { User, UserPermission } from '@/types/types';
import { LoginForm } from '@/components/forms/login-form.tsx';
import { PasswordResetRequestForm } from '@/components/forms/forgot-password-form.tsx';
import { PasswordResetForm } from '@/components/forms/reset-password-form.tsx';

export async function getProfile() {
  return backendQueryClient.fetchQuery({
    queryKey: ['profile'],
    queryFn: () => backendFetch<User, undefined>('/auth/profile'),
  });
}

export async function login(data: LoginForm) {
  try {
    const result = await backendQueryClient.fetchQuery({
      queryKey: ['login'],
      staleTime: 0,
      queryFn: () =>
        backendFetch<User, LoginForm>('/auth/login', {
          method: 'POST',
          data,
        }),
    });
    backendQueryClient.removeQueries({ queryKey: ['profile'] });

    return result;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const result = await backendQueryClient.fetchQuery({
      queryKey: ['logout'],
      staleTime: 0,
      queryFn: () => backendFetch<User, undefined>('/auth/logout'),
    });
    backendQueryClient.removeQueries({ queryKey: ['profile'] });

    return result;
  } catch (error) {
    throw error;
  }
}

export async function requestPasswordReset(data: PasswordResetRequestForm) {
  return backendQueryClient.fetchQuery({
    queryKey: ['password-reset-request'],
    staleTime: 0,
    queryFn: () =>
      backendFetch<unknown, PasswordResetRequestForm>('/auth/password/reset', {
        method: 'POST',
        data,
      }),
  });
}

export async function passwordReset(token: string, data: PasswordResetForm) {
  return backendQueryClient.fetchQuery({
    queryKey: ['password-reset'],
    staleTime: 0,
    queryFn: () =>
      backendFetch<unknown, PasswordResetForm>(
        '/auth/password/reset/' + token,
        {
          method: 'POST',
          data,
        },
      ),
  });
}

export async function userHasAccess(permissions: UserPermission[], slug: undefined|string = undefined) {
  return backendQueryClient.fetchQuery({
    queryKey: ['check-access', permissions],
    queryFn: () =>
      backendFetch<unknown, undefined>('/auth/check-access', {
        filters: {
          permissions,
          slug,
        },
      }),
  });
}
