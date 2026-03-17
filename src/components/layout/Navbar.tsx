import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import kychewLogo from '@/assets/kychew-logo.png';

const publicLinks = [
    { label: 'About', path: ROUTE_PATHS.ABOUT },
    { label: 'Contacts', path: ROUTE_PATHS.CONTACTS },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();
    const { currentUser } = useAuth();

    return (
        <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                        <img src={kychewLogo} alt="KYChew logo" className="h-full w-full object-cover" />

                    </div>
                    <span className="text-xl font-bold text-surface-900">
                        KY<span className="text-accent-600">Chew</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">

                    {currentUser ? (
                        <>
                            <Link
                                to={ROUTE_PATHS.DASHBOARD}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.DASHBOARD
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to={ROUTE_PATHS.JOBS}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.JOBS
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                                    }`}
                            >
                                Jobs
                            </Link>
                            <Link
                                to={ROUTE_PATHS.PROFILE}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.PROFILE
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                                    }`}
                            >
                                Profile
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={ROUTE_PATHS.ABOUT}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.PROFILE
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                                    }`}
                            >
                                About Us
                            </Link>
                            <Link
                                to={ROUTE_PATHS.CONTACTS}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.PROFILE
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                                    }`}
                            >
                                Contacts
                            </Link>
                        </>


                    )}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {currentUser ? (
                        <div className="flex items-center gap-3 rounded-lg bg-accent-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-surface-900">Aisha Bello</p>
                                <p className="truncate text-xs text-surface-500">Health Worker</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to={ROUTE_PATHS.LOGIN}>
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to={ROUTE_PATHS.REGISTER}>
                                <Button variant="primary" size="sm">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-surface-600 hover:bg-surface-100 md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <nav className="border-t border-surface-200 bg-white px-4 pb-4 pt-2 md:hidden" aria-label="Mobile navigation">
                    <div className="flex flex-col gap-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === link.path
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-surface-600 hover:bg-surface-100'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {currentUser && (
                            <>
                                <Link
                                    to={ROUTE_PATHS.DASHBOARD}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to={ROUTE_PATHS.PROFILE}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100"
                                >
                                    Profile
                                </Link>
                            </>
                        )}
                        <div className="mt-2 border-t border-surface-200 pt-2">
                            {currentUser ? (
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-surface-900">Aisha Bello</p>
                                    <p className="truncate text-xs text-surface-500">Health Worker</p>
                                </div>

                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to={ROUTE_PATHS.LOGIN} onClick={() => setMobileOpen(false)}>
                                        <Button variant="ghost" size="sm" fullWidth>
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to={ROUTE_PATHS.REGISTER} onClick={() => setMobileOpen(false)}>
                                        <Button variant="primary" size="sm" fullWidth>
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
