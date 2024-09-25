import { backendFetch, backendQueryClient } from '@/lib/backend-fetch';
import {
  LoginForm,
  PasswordResetForm,
  PasswordResetRequestForm,
} from '@/types/form-types';
import { User } from '@/types/types';

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
