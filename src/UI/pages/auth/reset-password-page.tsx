import ResetPasswordForm from '@/components/forms/reset-password-form';
import {useParams} from "react-router-dom";

export default function ForgotPasswordPage() {
  const { token } = useParams();
  return <ResetPasswordForm token={token ?? ''}/>;
}
