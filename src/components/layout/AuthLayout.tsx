import { Outlet } from 'react-router';
import Navbar from '@/components/layout/Navbar';

export default function PublicLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>

        </div>
    );
}
