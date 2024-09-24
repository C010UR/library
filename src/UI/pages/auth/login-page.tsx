import LoginForm from '@/components/forms/login-form.tsx';
import { getProfile } from '@/api/auth';
import { redirect } from 'react-router-dom';

export async function loginLoader() {
  const user = await getProfile(false);

  if (user !== undefined && !user.error) {
    return redirect('/');
  }

  return { user };
}

export default function LoginPage() {
  return <LoginForm />;
}
