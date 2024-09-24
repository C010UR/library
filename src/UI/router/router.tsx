import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/pages/error/error-page.tsx';
import LoginPage, { loginLoader } from '@/pages/auth/login-page.tsx';
import ForgotPasswordPage from "@/pages/auth/forgot-password-page.tsx";
import ResetPasswordPage from "@/pages/auth/reset-password-page.tsx";
import AuthPage from "@/pages/auth/auth-page.tsx";
import RootPage, { profileLoader } from "@/pages/root-page.tsx";

export default createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: profileLoader
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
        path: '/auth/reset-password/:token',
        element: <ResetPasswordPage />,
      }
    ]
  },
]);
