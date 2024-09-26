import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { useRequestPasswordReset } from '@/components/hooks/use-auth';
import { AnimatedButton } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardForm,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HOST_URL } from '@/lib/backend-fetch';
import { emailSchema, stringSchema } from '@/types/zod-schemas';

const formSchema = z.object({
  email: emailSchema(),
  hook: stringSchema(),
});

export type PasswordResetRequestForm = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const form = useForm<PasswordResetRequestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      hook: HOST_URL + '/auth/reset-password',
    },
  });

  const mutation = useRequestPasswordReset();

  function onSubmit(values: PasswordResetRequestForm) {
    mutation.mutate(values);
  }

  return (
    <CardForm>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              required
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      required
                      autoComplete="username"
                      disabled={mutation.isPending}
                      placeholder="user@example.com"
                      type="email"
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
              {mutation.isPending ? 'Sending...' : 'Send the Reset Link'}
            </AnimatedButton>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              Remember your password?{' '}
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
