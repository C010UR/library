import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button.tsx';

export default function AccessDeniedError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <ShieldAlert
        aria-hidden="true"
        className="w-16 h-16 text-destructive mb-4"
      />
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-xl mb-4">
        You do not have the permission to view this page
      </p>
      <p className="text-muted-foreground mb-8">Error: {message}</p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
