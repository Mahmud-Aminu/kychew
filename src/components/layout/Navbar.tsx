import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import kychewLogo from '@/assets/kychew-logo.png';

const navLinks = [
    { label: 'Home', path: ROUTE_PATHS.HOME },
    { label: 'Services', path: '/#services' },
    { label: 'Why Us', path: '/#why-us' },
    { label: 'Features', path: '/#features' },
    { label: 'Team', path: '/#team' },
    { label: 'Contact', path: ROUTE_PATHS.CONTACTS },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { pathname } = useLocation();
    const { currentUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Check initial scroll position
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = pathname === ROUTE_PATHS.HOME || pathname === '/';
    const isTransparent = isHome && !isScrolled;

    const navBgClass = isTransparent
        ? 'bg-transparent'
        : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-surface-200';

    const logoTextColor = isTransparent ? 'text-white' : 'text-surface-900';
    const linkColor = isTransparent ? 'text-white/80 hover:text-white' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100';
    const activeLinkColor = isTransparent ? 'text-white font-bold' : 'bg-primary-50 text-primary-700 font-bold';
    const mobileLinkColor = 'text-surface-600 hover:bg-surface-100 hover:text-surface-900';

    // Helper for smooth scrolling to sections
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        if (path.startsWith('/#')) {
            const id = path.substring(2);
            const element = document.getElementById(id);
            if (element) {
                e.preventDefault();
                element.scrollIntoView({ behavior: 'smooth' });
                setMobileOpen(false);
            }
        } else {
            setMobileOpen(false);
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                        <img src={kychewLogo} alt="KYChew logo" className="h-full w-full object-contain" />
                    </div>
                    <span className={`text-xl font-bold transition-colors ${logoTextColor}`}>
                        KY<span className="text-accent-500">Chew</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.path || (pathname === '/' && link.path === '/');
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkColor : linkColor}`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {currentUser && (
                        <>
                            <Link
                                to={ROUTE_PATHS.DASHBOARD}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.DASHBOARD ? activeLinkColor : linkColor}`}
                            >
                                Dashboard
                            </Link>
                        </>
                    )}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {currentUser ? (
                        <Link to={ROUTE_PATHS.PROFILE} className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-surface-100'}`}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className={`truncate text-sm font-medium ${isTransparent ? 'text-white' : 'text-surface-900'}`}>Aisha Bello</p>
                                <p className={`truncate text-xs ${isTransparent ? 'text-white/70' : 'text-surface-500'}`}>Health Worker</p>
                            </div>
                        </Link>
                    ) : (
                        <>
                            <Link to={ROUTE_PATHS.LOGIN}>
                                <Button variant={isTransparent ? 'outline' : 'ghost'} size="sm" className={isTransparent ? 'border-white/50 text-white hover:bg-white/10' : ''}>
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
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden ${isTransparent ? 'text-white hover:bg-white/10' : 'text-surface-600 hover:bg-surface-100'}`}
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
                <nav className="border-t border-surface-200 bg-white px-4 pb-4 pt-2 md:hidden shadow-lg" aria-label="Mobile navigation">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === link.path
                                    ? 'bg-primary-50 text-primary-700'
                                    : mobileLinkColor
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
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === ROUTE_PATHS.DASHBOARD ? 'bg-primary-50 text-primary-700' : mobileLinkColor}`}
                                >
                                    Dashboard
                                </Link>
                                <div className="mt-2 border-t border-surface-200 pt-3 pb-1">
                                    <Link to={ROUTE_PATHS.PROFILE} onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                                            A
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-surface-900">Aisha Bello</p>
                                            <p className="truncate text-xs text-surface-500">Health Worker</p>
                                        </div>
                                    </Link>
                                </div>
                            </>
                        )}
                        {!currentUser && (
                            <div className="mt-2 border-t border-surface-200 pt-3 flex flex-col gap-2">
                                <Link to={ROUTE_PATHS.LOGIN} onClick={() => setMobileOpen(false)}>
                                    <Button variant="outline" size="sm" fullWidth>
                                        Login
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
                </nav>
            )}
        </header>
    );
}
