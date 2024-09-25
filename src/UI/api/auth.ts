import { backendFetch, backendQueryClient } from '@/lib/backend-fetch';
import {
  LoginForm,
  PasswordResetForm,
  PasswordResetRequestForm,
} from '@/types/form-types';
import { User } from '@/types/types';

export function getProfile() {
  return backendQueryClient.fetchQuery({
    queryKey: ['profile'],
    queryFn: () => backendFetch<User, undefined>('/auth/profile'),
  });
}

export function login(data: LoginForm) {
  return backendQueryClient.fetchQuery({
    queryKey: ['login'],
    staleTime: 0,
    queryFn: () =>
      backendFetch<User, LoginForm>('/auth/login', {
        method: 'POST',
        data,
      }),
  });
}

export function logout() {
  return backendQueryClient.fetchQuery({
    queryKey: ['logout'],
    staleTime: 0,
    queryFn: () => backendFetch<User, undefined>('/auth/logout'),
  });
}

export function requestPasswordReset(data: PasswordResetRequestForm) {
  return backendQueryClient.fetchQuery({
    queryKey: ['login'],
    staleTime: 0,
    queryFn: () =>
      backendFetch<unknown, PasswordResetRequestForm>(
        '/auth/password/reset',
        {
          method: 'POST',
          data,
        },
      ),
  });
}

export function passwordReset(token: string, data: PasswordResetForm) {
  return backendQueryClient.fetchQuery({
    queryKey: ['login'],
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
