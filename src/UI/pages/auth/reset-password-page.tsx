import {useParams} from "react-router-dom";

import ResetPasswordForm from '@/components/forms/reset-password-form';

export default function ForgotPasswordPage() {
  const { token } = useParams();
  return <ResetPasswordForm token={token ?? ''}/>;
}
