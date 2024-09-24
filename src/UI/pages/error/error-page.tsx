import { useRouteError } from 'react-router-dom';
import GenericError from './generic-error-page.tsx';
import NotFoundPage from './not-found-error-page.tsx';

export default function Error() {
  const error: any = useRouteError();
  let errorMessage =
    (error.statusText as string) ||
    (error.message as string) ||
    'An unexpected error occurred';

  switch (errorMessage) {
    case 'Not Found':
      return <NotFoundPage />;
    default:
      return <GenericError errorMessage={errorMessage} />;
  }
}
