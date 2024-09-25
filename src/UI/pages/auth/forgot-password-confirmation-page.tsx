import { CheckCircle2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardFooter,
  CardForm,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ForgotPasswordConfirmationPage() {
  return (
    <CardForm>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2Icon className="w-12 h-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Password Reset Request Sent
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          We've sent a password reset link to your email address. Please check
          your inbox and follow the instructions to reset your password. The
          link will be valid for the next 2 hours.
        </p>
        <p className="text-sm text-gray-500">
          If you don't receive the email within 5 minutes, please check your
          spam folder or try resetting your password again.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link to="/auth/login">Return to Login</Link>
        </Button>
      </CardFooter>
    </CardForm>
  );
}
