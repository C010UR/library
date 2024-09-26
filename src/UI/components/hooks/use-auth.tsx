import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getProfile,
  login,
  logout,
  passwordReset,
  requestPasswordReset,
} from '@/api/auth';
import { authMessages as messages } from '@/types/messages.ts';
import { backendQueryClient } from '@/lib/backend-fetch.ts';
import { useNavigate } from 'react-router-dom';
import type { LoginForm } from '@/components/forms/login-form';
import { PasswordResetRequestForm } from '@/components/forms/forgot-password-form';
import { PasswordResetForm } from '@/components/forms/reset-password-form';

export function useProfileProfile() {
  return useMutation({
    mutationKey: ['profile'],
    mutationFn: () => getProfile(),
    onSuccess: () => {
      toast.success(messages.loggedIn);
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LoginForm) => login(data),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: () => {
      navigate('/');
      backendQueryClient.removeQueries({ queryKey: ['profile'] });
      toast.success(messages.loggedIn);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => logout(),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: () => {
      navigate('/auth/login');
      backendQueryClient.removeQueries({ queryKey: ['profile'] });
      toast.success(messages.loggedOut);
    },
  });
}

export function useRequestPasswordReset() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: PasswordResetRequestForm) => requestPasswordReset(data),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: () => {
      navigate('/auth/reset-password-confirm');
    },
  });
}

export function usePasswordReset({ token }: { token: string }) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: PasswordResetForm) => passwordReset(token, data),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: () => {
      navigate('/auth/reset-password-confirm');
    },
  });
}
