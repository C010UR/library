import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {deleteUser, updateUser} from '@/api/user';
import { UpdateUserForm } from '@/components/forms/update-user-form';
import { userMessages as messages } from '@/types/messages';
import { User } from '@/types/types';
import {useNavigate} from "react-router-dom";

export function useUpdateUser(user: User) {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['user', user.id],
    mutationFn: (data: UpdateUserForm) => updateUser(user, data),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: (data) => {
      navigate('/user/' + data.slug)
      toast.success(messages.updated);
    },
  });
}

export function useDeleteUser(user: User) {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ['user', user.id],
    mutationFn: () => deleteUser(user),
    onError: (data) => {
      toast.error(messages.error, {
        description: data.message,
      });
    },
    onSuccess: () => {
      navigate('/')
      toast.success(messages.updated);
    },
  });
}
