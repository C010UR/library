import { useRouteError } from 'react-router-dom';

import GenericError from '@/pages/error/generic-error-page';
import NotFoundPage from '@/pages/error/not-found-error-page';

export default function Error() {
  const error = useRouteError() as {
    statusText: undefined | string;
    message: undefined | string;
  };

  const errorMessage =
    error.statusText || error.message || 'An unexpected error occurred';

  switch (errorMessage) {
    case 'Not Found':
      return <NotFoundPage />;
    default:
      return <GenericError errorMessage={errorMessage} />;
  }
}
