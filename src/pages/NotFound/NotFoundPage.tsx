import { Link } from 'react-router';
import Button from '@/components/common/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <p className="text-7xl font-extrabold text-primary-600">404</p>
            <h1 className="mt-4 text-2xl font-bold text-surface-900">Page Not Found</h1>
            <p className="mt-2 text-surface-500">
                The page you&#39;re looking for doesn&#39;t exist or has been moved.
            </p>
            <Link to={ROUTE_PATHS.HOME} className="mt-6">
                <Button>Back to Home</Button>
            </Link>
        </div>
    );
}
