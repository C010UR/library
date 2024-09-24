import { backendFetch } from '@/lib/backend-fetch';
import { User } from '@/types/types';
import {PasswordResetRequestForm, LoginForm, PasswordResetForm} from '@/types/form-types';

export function getProfile(isThrow: boolean = true) {
  return backendFetch<User, undefined>('/auth/profile', { isThrow });
}

export function login(data: LoginForm, isThrow: boolean = true) {
  return backendFetch<User, LoginForm>('/auth/login', {
    method: 'POST',
    data,
    isThrow,
  });
}

export function logout(isThrow: boolean = true) {
  return backendFetch<undefined, undefined>('/auth/logout', { isThrow });
}

export function requestPasswordReset(
  data: PasswordResetRequestForm,
  isThrow: boolean = true,
) {
  return backendFetch<undefined, PasswordResetRequestForm>(
    '/auth/password/reset',
    {
      method: 'POST',
      data,
      isThrow,
    },
  );
}


export function passwordReset(
    token: string,
    data: PasswordResetForm,
    isThrow: boolean = true,
) {
    return backendFetch<undefined, PasswordResetForm>(
        '/auth/password/reset/' + token,
        {
            method: 'POST',
            data,
            isThrow,
        },
    );
}
