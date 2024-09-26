import { useRouteError } from 'react-router-dom';

import GenericError from '@/components/errors/generic-error.tsx';
import NotFoundError from '@/components/errors/not-found-error.tsx';
import AccessDeniedError from '@/components/errors/access-denied-error.tsx';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function Error() {
  const error = useRouteError() as {
    statusText: undefined | string;
    message: undefined | string;
    status: undefined | number;
  };

  const errorMessage =
    error.message || error.statusText || 'An unexpected error occurred';

  let page = <GenericError message={errorMessage} />;

  switch (error.status) {
    case 404:
      page = <NotFoundError />;
      break;
    case 403:
    case 401:
      page = <AccessDeniedError message={errorMessage} />;
      break;
  }

  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {page}
    </>
  );
}
