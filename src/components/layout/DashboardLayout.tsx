import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import Sidebar from '@/components/layout/Sidebar';
import { ROUTE_PATHS } from '@/routes/routePaths';
import type { NavItem } from '@/types/models';
import { HiOutlineBell, HiOutlineBriefcase, HiOutlineHome, HiOutlineIdentification, HiOutlineUser } from 'react-icons/hi';
import kychewLogo from '@/assets/kychew-logo.png';


const mobileNavItems: NavItem[] = [
    { label: 'Dashboard', path: ROUTE_PATHS.DASHBOARD, icon: HiOutlineHome },
    { label: 'Jobs', path: ROUTE_PATHS.JOBS, icon: HiOutlineBriefcase },
    { label: 'Profile', path: ROUTE_PATHS.PROFILE, icon: HiOutlineUser },
    { label: 'ID Card', path: ROUTE_PATHS.ID_CARD, icon: HiOutlineIdentification },
];

export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Mock notifications - replace with real data
    const notifications = [
        { id: 1, message: 'Your profile has been verified', time: '2 hours ago', read: false },
        { id: 2, message: 'New job opportunity available', time: '5 hours ago', read: false },
        { id: 3, message: 'Your ID card is ready to download', time: '1 day ago', read: true },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-surface-50">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                    <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b border-surface-200 px-6">
                            <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg shadow-primary-500/20">
                                    <img src={kychewLogo} alt="KYChew logo" className="h-full w-full object-cover" />

                                </div>
                                <span className="text-lg font-bold text-surface-900">
                                    KY<span className="text-accent-600">CHEW</span>
                                </span>
                            </Link>
                            <button
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close sidebar"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="space-y-1 px-3 py-4">
                            {mobileNavItems.map((item) => {
                                const isActive = pathname === item.path;
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                                            }`}
                                    >
                                        <span className="text-lg" aria-hidden="true">
                                            <Icon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                                        </span>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-surface-200 bg-white px-4 sm:px-6">
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-surface-600 hover:bg-surface-100 lg:hidden"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            onClick={() => setNotificationOpen(!notificationOpen)}
                            className="relative flex items-center gap-3 rounded-lg bg-accent-50 p-3 hover:bg-accent-100 transition-colors"
                            aria-label="Notifications"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                                <HiOutlineBell className='h-8 w-8 text-yellow-500' />
                            </div>
                            {notifications.length > 0 && (
                                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {notifications.length}
                                </span>
                            )}
                        </button>

                        <button
                            className="flex items-center gap-3 rounded-lg bg-surface-100 p-3 hover:bg-surface-200 transition-colors"
                            onClick={() => navigate(ROUTE_PATHS.PROFILE)}
                            aria-label="User menu"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                                <HiOutlineUser className='h-8 w-8' />
                            </div>
                        </button>
                    </div>

                    {/* Notification modal */}
                    {notificationOpen && (
                        <div className="absolute right-4 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-surface-200 bg-white shadow-lg">
                            <div className="border-b border-surface-200 px-4 py-3 flex items-center justify-between">
                                <h3 className="font-semibold text-surface-900">Notifications</h3>
                                <button
                                    onClick={() => setNotificationOpen(false)}
                                    className="text-surface-400 hover:text-surface-600"
                                    aria-label="Close notifications"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border-b border-surface-100 px-4 py-3 hover:bg-surface-50 transition-colors ${!notification.read ? 'bg-accent-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-surface-900' : 'text-surface-700'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-surface-500 mt-1">{notification.time}</p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="h-2 w-2 rounded-full bg-accent-600 flex-shrink-0 mt-1" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-surface-500">
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-surface-200 px-4 py-3">
                                <button className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
