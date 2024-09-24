import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRequestPasswordReset } from '@/components/hooks/use-auth.tsx';
import { HOST_URL } from '@/lib/backend-fetch';

const formSchema = z.object({
  email: z.string().email(),
  hook: z.string(),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      hook: HOST_URL + '/reset-password',
    },
  });

  const mutation = useRequestPasswordReset();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-[350px] md:w-[500px]">
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
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={mutation.isPending}
                      placeholder="user@example.com"
                      required
                      type="email"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Sending...' : 'Send the Reset Link'}
            </Button>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              Remember your password?{' '}
              <Link to="/auth/login" className="underline hover:text-primary">
                Back to login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
