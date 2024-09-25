import { redirect } from 'react-router-dom';

import { getProfile } from '@/api/auth';
import LoginForm from '@/components/forms/login-form';

export async function loginLoader() {
  try {
    const user = await getProfile();

    if (user) {
      return redirect('/');
    }

    return { user };
  } catch (_) {}

  return { user: null };
}

export default function LoginPage() {
  return <LoginForm />;
}
