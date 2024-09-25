import { createBrowserRouter } from 'react-router-dom';

import AuthPage from '@/pages/auth/auth-page';
import ForgotPasswordPage from '@/pages/auth/forgot-password-page';
import LoginPage, { loginLoader } from '@/pages/auth/login-page';
import ResetPasswordPage from '@/pages/auth/reset-password-page';
import ErrorPage from '@/pages/error/error-page';
import RootPage, { profileLoader } from '@/pages/root-page';
import ForgotPasswordConfirmationPage from "@/pages/auth/forgot-password-confirmation-page.tsx";
import ResetPasswordConfirmationPage from "@/pages/auth/reset-password-confirmation-page.tsx";

export default createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: profileLoader,
  },
  {
    path: '/auth',
    element: <AuthPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: '/auth/login',
        element: <LoginPage />,
        loader: loginLoader,
      },
      {
        path: '/auth/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/auth/forgot-password-confirm',
        element: <ForgotPasswordConfirmationPage />,
      },
      {
        path: '/auth/reset-password/:token',
        element: <ResetPasswordPage />,
      },
      {
        path: '/auth/reset-password-confirm',
        element: <ResetPasswordConfirmationPage />,
      },
    ],
  },
]);
