import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function NotFoundErrorPage() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
          <FileQuestion className="w-16 h-16 text-muted-foreground mb-4"/>
          <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
          <p className="text-xl mb-4">
              Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-muted-foreground mb-8">
              It might have been moved or deleted.
          </p>
          <div className="flex space-x-4">
              <Button asChild variant="outline">
                  <Link to="">Go back home</Link>
              </Button>
              <Button asChild>
                  <Link to="/contact">Contact support</Link>
              </Button>
          </div>
      </div>
  );
}
