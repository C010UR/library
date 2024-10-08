import { createBrowserRouter } from 'react-router-dom';

import AuthPage from '@/pages/auth/auth-page';
import ForgotPasswordPage from '@/pages/auth/forgot-password-page';
import LoginPage, { loginLoader } from '@/pages/auth/login-page';
import ResetPasswordPage from '@/pages/auth/reset-password-page';
import ErrorPage from '@/pages/error/error-page';
import RootPage, { profileLoader } from '@/pages/root-page';
import ForgotPasswordConfirmationPage from '@/pages/auth/forgot-password-confirmation-page.tsx';
import ResetPasswordConfirmationPage from '@/pages/auth/reset-password-confirmation-page.tsx';
import ShowUserPage, { userShowLoader } from '@/pages/show/show-user-page.tsx';
import ShowPermissionPage, {permissionLoader} from "@/pages/show/show-permission-page.tsx";
import UpdateUserPage, {userUpdateLoader} from "@/pages/update/update-user-page.tsx";
import ListUsersPage, {userListLoader} from "@/pages/list/list-users-page.tsx";

export default createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: profileLoader,
    children: [
      {
        path: '/user/list',
        element: <ListUsersPage />,
        loader: userListLoader,
      },
      {
        path: '/user/:slug',
        element: <ShowUserPage />,
        loader: userShowLoader,
      },
      {
        path: '/user/:slug/update',
        element: <UpdateUserPage />,
        loader: userUpdateLoader,
      },
      {
        path: '/profile',
        element: <ShowUserPage />,
        loader: profileLoader,
      },
      {
        path: '/permission/:name',
        element: <ShowPermissionPage />,
        loader: permissionLoader,
      },
    ],
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
