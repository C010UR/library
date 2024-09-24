import { useMutation } from '@tanstack/react-query';
import {
  LoginForm,
  PasswordResetForm,
  PasswordResetRequestForm,
} from '@/types/form-types';
import { toast } from 'sonner';
import {
  login,
  logout,
  getProfile,
  requestPasswordReset,
  passwordReset,
} from '@/api/auth';

export function useProfileQuery() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: () => getProfile(),
    onSuccess: (data) => {
      toast.success('Successfully Logged In.');
      console.log(data);
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginForm) => login(data),
    onError: (data) => {
      toast.error('Uh oh! Something went wrong.', {
        description:
          data?.response?.data?.message ??
          data?.message ??
          'There was a problem with your request',
      });
    },
    onSuccess: (data) => {
      toast.success('Successfully Logged In.');
      console.log(data);
    },
  });
}

export function useLogoutQuery() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: () => logout(),
    onError: (data) => {
      toast.error('Uh oh! Something went wrong.', {
        description: data?.message ?? 'There was a problem with your request',
      });
    },
    onSuccess: (data) => {
      toast.success('Successfully Logged out.');
      console.log(data);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestForm) => requestPasswordReset(data),
    onError: (data) => {
      toast.error('Uh oh! Something went wrong.', {
        description:
          data?.response?.data?.message ??
          data?.message ??
          'There was a problem with your request',
      });
    },
    onSuccess: (data) => {
      toast.success('Successfully Logged In.');
      console.log(data);
    },
  });
}

export function usePasswordReset({ token }: { token: string }) {
  return useMutation({
    mutationFn: (data: PasswordResetForm) => passwordReset(token, data),
    onError: (data) => {
      toast.error('Uh oh! Something went wrong.', {
        description:
          data?.response?.data?.message ??
          data?.message ??
          'There was a problem with your request',
      });
    },
    onSuccess: (data) => {
      toast.success('Successfully Logged In.');
      console.log(data);
    },
  });
}
