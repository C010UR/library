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

export default function ResetPasswordConfirmationPage() {
  return (
    <CardForm>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2Icon className="w-12 h-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold">Password Was Reset</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          Your password has been reset successfully. Remember to keep your
          password secure and do not share it with anyone.
        </p>
        <p className="text-sm text-gray-500">
          If you encounter any issues, feel free to contact our support team.
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
