import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getProfile,
  login,
  logout,
  passwordReset,
  requestPasswordReset,
} from '@/api/auth';
import {
  LoginForm,
  PasswordResetForm,
  PasswordResetRequestForm,
} from '@/types/form-types';
import { authMessages as messages } from '@/types/messages.ts';

export function useProfileQuery() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: () => getProfile(),
    onSuccess: (data) => {
      toast.success(messages.loggedIn);
      console.log(data);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginForm) => login(data),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      toast.success(messages.loggedIn);
      console.log(data);
    },
  });
}

export function useLogoutQuery() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: () => logout(),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      toast.success(messages.loggedOut);
      console.log(data);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestForm) => requestPasswordReset(data),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      toast.success(messages.passwordResetRequest);
      console.log(data);
    },
  });
}

export function usePasswordReset({ token }: { token: string }) {
  return useMutation({
    mutationFn: (data: PasswordResetForm) => passwordReset(token, data),
    onError: (data) => {
      console.log(data);
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      toast.success(messages.passwordReset);
      console.log(data);
    },
  });
}
