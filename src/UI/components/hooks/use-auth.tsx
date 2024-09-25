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
import {backendQueryClient} from "@/lib/backend-fetch.ts";
import {useNavigate} from "react-router-dom";

export function useProfileQuery() {
  return useMutation({
    mutationKey: ['profile'],
    mutationFn: () => getProfile(),
    onSuccess: (data) => {
      toast.success(messages.loggedIn);
      console.log(data);
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
    onSuccess: (data) => {
      navigate('/');
      backendQueryClient.removeQueries({ queryKey: ['profile']})
      toast.success(messages.loggedIn);
      console.log(data);
    },
  });
}

export function useLogoutQuery() {
  return useMutation({
    mutationFn: () => logout(),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      backendQueryClient.removeQueries({ queryKey: ['profile']})
      toast.success(messages.loggedOut);
      console.log(data);
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
    onSuccess: (data) => {
      navigate('/auth/reset-password-confirm');
      toast.success(messages.passwordResetRequest);
      console.log(data);
    },
  });
}

export function usePasswordReset({ token }: { token: string }) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: PasswordResetForm) => passwordReset(token, data),
    onError: (data) => {
      console.log(data);
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      navigate('/auth/reset-password-confirm');
      toast.success(messages.passwordReset);
      console.log(data);
    },
  });
}
