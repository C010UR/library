import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { usePasswordReset } from '@/components/hooks/use-auth';
import { AnimatedButton } from '@/components/ui/button';
import {
  CardContent,
  CardFooter,
  CardForm,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/input';
import { formErrorMessages } from '@/types/messages.ts';
import { passwordSchema, stringSchema } from '@/types/zod-schemas';

const formSchema = z
  .object({
    password: passwordSchema(),
    confirmPassword: stringSchema(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: formErrorMessages.password.dontMatch,
    path: ['confirmPassword'],
  });

export type PasswordResetForm = z.infer<typeof formSchema>;

export default function ForgotPasswordForm({ token }: { token: string }) {
  const form = useForm<PasswordResetForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = usePasswordReset({ token });

  function onSubmit(values: PasswordResetForm) {
    mutation.mutate({ password: values.password });
  }

  return (
    <CardForm>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              required
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters long and include
                    uppercase, lowercase, number, and special character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardContent className="grid gap-4">
            <FormField
              required
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <AnimatedButton
              className="w-full"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? 'Sending...' : 'Reset Password'}
            </AnimatedButton>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              Don't want to change the password?{' '}
              <Link className="underline hover:text-primary" to="/auth/login">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </CardForm>
  );
}
