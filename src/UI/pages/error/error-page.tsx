import { useRouteError } from 'react-router-dom';

import GenericError from '@/pages/error/generic-error-page';
import NotFoundPage from '@/pages/error/not-found-error-page';
import ThemeToggle from '@/components/ui/theme-toggle.tsx';

export default function Error() {
  const error = useRouteError() as {
    statusText: undefined | string;
    message: undefined | string;
  };

  const errorMessage =
    error.message || error.statusText || 'An unexpected error occurred';

  let page = <GenericError errorMessage={errorMessage} />;

  switch (errorMessage) {
    case 'Not Found':
    case 'Resource not found':
      page = <NotFoundPage />;
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
