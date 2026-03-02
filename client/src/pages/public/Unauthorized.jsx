import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Unauthorized() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 motion-safe-fade-in">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary mb-2">
          Access Denied
        </h1>
        <p className="text-text-secondary dark:text-text-darkSecondary mb-6">
          You don&apos;t have permission to view this page. If you believe this is an error, please contact support.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
