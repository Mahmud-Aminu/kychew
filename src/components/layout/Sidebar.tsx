import { Link, useLocation } from 'react-router';
import { ROUTE_PATHS } from '@/routes/routePaths';
import type { NavItem } from '@/types/models';
import Button from '../common/Button';
import { useAuth } from '@/hooks/useAuth';
import { HiOutlineBriefcase, HiOutlineHome, HiOutlineIdentification, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import kychewLogo from '@/assets/kychew-logo.png';


const navItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTE_PATHS.DASHBOARD, icon: HiOutlineHome },
    { label: 'Jobs', path: ROUTE_PATHS.JOBS, icon: HiOutlineBriefcase },
    { label: 'Profile', path: ROUTE_PATHS.PROFILE, icon: HiOutlineUser },
    { label: 'ID Card', path: ROUTE_PATHS.ID_CARD, icon: HiOutlineIdentification },
];

export default function Sidebar() {
    const { pathname } = useLocation();
    const { logout } = useAuth();


    return (
        <aside className="hidden w-64 shrink-0 border-r border-surface-200 bg-white lg:block">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-surface-200 px-6">
                    <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg shadow-primary-500/20">
                            <img src={kychewLogo} alt="KYChew logo" className="h-full w-full object-cover" />

                        </div>
                        <span className="text-lg font-bold text-surface-900">
                            KY<span className="text-accent-600">CHEW</span>
                        </span>
                    </Link>
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Sidebar navigation">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-colors duration-150
                  ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                                    }
                `}
                            >
                                <span className="text-lg" aria-hidden="true">
                                                                            <Icon className="h-5 w-5 text-blue-500" aria-hidden="true" />

                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="border-t border-surface-200 p-4">
                    <div className="flex items-center gap-3 rounded-lg bg-accent-50 p-3">
                        <Button variant="ghost" size="sm" fullWidth onClick={logout}>
                            <HiOutlineLogout className='h-5 w-5 text-blue-500' aria-hidden= 'true' /> Logout
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
