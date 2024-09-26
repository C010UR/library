import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function GenericError({
  errorMessage,
}: {
  errorMessage: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-4xl font-bold mb-2">Oops! Something went wrong</h1>
      <p className="text-xl mb-4">We apologize for the inconvenience</p>
      <p className="text-muted-foreground mb-8">Error: {errorMessage}</p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/public">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
