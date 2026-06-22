import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import QRCode from 'react-qr-code';
import {
    HiOutlineIdentification,
    HiOutlineUser,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineBell,
    HiOutlineCog,
    HiOutlineDocumentText,
    HiOutlineSupport,
    HiOutlineX,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineShieldCheck,
    HiOutlineTrash
} from 'react-icons/hi';

// Mock resources data
const resourcesList = [
    { id: 'res-1', title: 'CHEW Practice Guidelines & Professional Code', size: '2.4 MB', file: 'CHEW_Guidelines_v2.pdf' },
    { id: 'res-2', title: 'Katsina State Primary Healthcare Policy Document', size: '1.8 MB', file: 'PHC_Policy_Katsina.pdf' },
    { id: 'res-3', title: 'KYCHEW Association Constitution (Amended)', size: '3.1 MB', file: 'KYCHEW_Constitution_2025.pdf' },
];

// Katsina Local Government Areas
const katsinaLGAs = [
    { value: 'Katsina', label: 'Katsina LGA' },
    { value: 'Daura', label: 'Daura LGA' },
    { value: 'Funtua', label: 'Funtua LGA' },
    { value: 'Malumfashi', label: 'Malumfashi LGA' },
    { value: 'Dutsin-Ma', label: 'Dutsin-Ma LGA' },
    { value: 'Kankia', label: 'Kankia LGA' },
    { value: 'Bakori', label: 'Bakori LGA' },
    { value: 'Batagarawa', label: 'Batagarawa LGA' },
    { value: 'Baure', label: 'Baure LGA' },
    { value: 'Bindawa', label: 'Bindawa LGA' },
    { value: 'Charanci', label: 'Charanci LGA' },
];

export default function DashboardPage() {
    const { userProfile } = useAuth();

    // Tabs state
    const [activeTab, setActiveTab] = useState<'overview' | 'notifications' | 'settings'>('overview');

    // Theme state
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('kychew_theme');
        if (savedTheme === 'dark' || (!savedTheme && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
        return 'light';
    });

    // Modals state
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // Profile helper to load initially
    const getInitialProfileVal = (key: 'fullName' | 'phone' | 'lga' | 'bio', fallback: string) => {
        const storedProfile = localStorage.getItem('kychew_saved_profile');
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                if (parsed[key]) return parsed[key];
            } catch {
                // ignore
            }
        }
        return fallback;
    };

    // Profile inputs state
    const [fullName, setFullName] = useState(() => getInitialProfileVal('fullName', 'Aisha Bello'));
    const [phone, setPhone] = useState(() => getInitialProfileVal('phone', '+234 801 234 5678'));
    const [lga, setLga] = useState(() => getInitialProfileVal('lga', 'Katsina'));
    const [bio, setBio] = useState(() => getInitialProfileVal('bio', 'Dedicated community health worker with 3+ years of experience in maternal and child health programs across Katsina State.'));
    const [isProfileSaved, setIsProfileSaved] = useState(false);

    // Password change mock state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Support Form mock state
    const [supportSubject, setSupportSubject] = useState('License Verification');
    const [supportMessage, setSupportMessage] = useState('');
    const [supportSuccess, setSupportSuccess] = useState(false);
    const [isSupportLoading, setIsSupportLoading] = useState(false);

    // Resources download mock state
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

    // Preferences states
    const [emailAlerts, setEmailAlerts] = useState(() => {
        const stored = localStorage.getItem('kychew_pref_email');
        return stored === null ? true : stored === 'true';
    });
    const [smsAlerts, setSmsAlerts] = useState(() => {
        const stored = localStorage.getItem('kychew_pref_sms');
        return stored === 'true';
    });

    // Notifications state
    const [notifications, setNotifications] = useState([
        {
            id: 'n-1',
            title: 'Digital ID Card Generated',
            message: 'Your digital membership ID card has been successfully generated and is ready for download or view.',
            time: '2 hours ago',
            type: 'system',
            read: false,
        },
        {
            id: 'n-2',
            title: 'PHC Expansion Initiative',
            message: 'Katsina State Ministry of Health announces primary healthcare center expansion program starting July 15.',
            time: '1 day ago',
            type: 'announcement',
            read: false,
        },
        {
            id: 'n-3',
            title: 'Annual General Meeting',
            message: 'Katsina State CHEW Annual General Meeting (AGM) scheduled for October 12, 2026. Attendance is mandatory.',
            time: '3 days ago',
            type: 'reminder',
            read: true,
        },
        {
            id: 'n-4',
            title: 'Profile Completion Required',
            message: 'Please ensure your state license verification number is uploaded to your profile page to avoid limitations.',
            time: '1 week ago',
            type: 'alert',
            read: true,
        },
    ]);

    // Side effect to sync dark mode classes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        if (userProfile && !localStorage.getItem('kychew_saved_profile')) {
            const timer = setTimeout(() => {
                setFullName(userProfile.fullName);
                setPhone(userProfile.phone);
                setLga(userProfile.lga);
                if (userProfile.bio) setBio(userProfile.bio);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [userProfile]);

    // Handle profile update
    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const profileObj = { fullName, phone, lga, bio };
        localStorage.setItem('kychew_saved_profile', JSON.stringify(profileObj));
        setIsProfileSaved(true);
        setTimeout(() => setIsProfileSaved(false), 3000);
    };

    // Toggle Dark Mode
    const handleThemeToggle = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        localStorage.setItem('kychew_theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Save preferences
    const handlePreferenceToggle = (type: 'email' | 'sms') => {
        if (type === 'email') {
            const next = !emailAlerts;
            setEmailAlerts(next);
            localStorage.setItem('kychew_pref_email', String(next));
        } else {
            const next = !smsAlerts;
            setSmsAlerts(next);
            localStorage.setItem('kychew_pref_sms', String(next));
        }
    };

    // Password change submission
    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword) {
            setPasswordError('Current password is required.');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Confirm password does not match.');
            return;
        }

        setIsPasswordLoading(true);
        setTimeout(() => {
            setIsPasswordLoading(false);
            setPasswordSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }, 1500);
    };

    // Support Request submission
    const handleSupportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supportMessage.trim()) return;

        setIsSupportLoading(true);
        setTimeout(() => {
            setIsSupportLoading(false);
            setSupportSuccess(true);
            setSupportMessage('');
        }, 1200);
    };

    // Download Resource simulation
    const handleDownloadResource = (id: string) => {
        setDownloadingId(id);
        setTimeout(() => {
            setDownloadingId(null);
            setDownloadedIds((prev) => [...prev, id]);
        }, 1000);
    };

    // Mark single notification as read
    const toggleNotificationRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
    };

    // Mark all notifications as read
    const markAllNotificationsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // Dismiss single notification
    const dismissNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    // Compute display data
    const initials = fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const membershipId = userProfile?.membershipId || 'KATS-CHEW-2026-8801';
    const paymentStatus = userProfile?.payment_status || 'completed'; // default dummy is completed
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-surface-200 dark:border-surface-800">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                        activeTab === 'overview'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                            : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white'
                    }`}
                >
                    <HiOutlineIdentification className="h-5 w-5" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all cursor-pointer relative ${
                        activeTab === 'notifications'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                            : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white'
                    }`}
                >
                    <HiOutlineBell className="h-5 w-5" />
                    Notifications
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full bg-red-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                        activeTab === 'settings'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                            : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-white'
                    }`}
                >
                    <HiOutlineCog className="h-5 w-5" />
                    Settings
                </button>
            </div>

            {/* TAB CONTENTS */}

            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Welcome Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-700 dark:to-accent-700 px-6 py-10 sm:px-8 sm:py-12 shadow-lg">
                        <div className="absolute inset-0 opacity-10">
                            <svg className="h-full w-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="100" cy="50" r="80" fill="none" stroke="white" strokeWidth="1" />
                                <circle cx="700" cy="350" r="100" fill="none" stroke="white" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm border border-white/25">
                                {initials}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                        Welcome back, {fullName}! 👋
                                    </h1>
                                    <Badge
                                        variant={paymentStatus === 'completed' ? 'green' : 'amber'}
                                        className="mt-1 sm:mt-0 text-white bg-white/10 dark:bg-white/10"
                                    >
                                        {paymentStatus === 'completed' ? 'Verified Member' : 'Pending Verification'}
                                    </Badge>
                                </div>
                                <p className="mt-2 text-sm text-primary-100 max-w-xl">
                                    Manage your credential profiles, check state job listings, track compliance guidelines, and connect with Katsina State chapter administration.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid gap-6 sm:grid-cols-3">
                        <Card className="flex items-center gap-4 border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 hover:shadow-md transition-shadow">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400">
                                <HiOutlineShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Membership</p>
                                <p className="text-lg font-bold text-surface-900 dark:text-white">
                                    {paymentStatus === 'completed' ? 'Active / Verified' : 'Pending Verification'}
                                </p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">Expires Oct 31, 2026</p>
                            </div>
                        </Card>

                        <Card className="flex items-center gap-4 border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 hover:shadow-md transition-shadow">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                                <HiOutlineBell className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Alerts & News</p>
                                <p className="text-lg font-bold text-surface-900 dark:text-white">
                                    {unreadCount} New {unreadCount === 1 ? 'Message' : 'Messages'}
                                </p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">Requires attention</p>
                            </div>
                        </Card>

                        <Card className="flex items-center gap-4 border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 hover:shadow-md transition-shadow">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                <HiOutlineClock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Next Deadline</p>
                                <p className="text-lg font-bold text-surface-900 dark:text-white">October 31, 2026</p>
                                <p className="text-xs text-surface-500 dark:text-surface-400">CHEW State License Renewal</p>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Actions Grid */}
                    <div>
                        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="grid gap-6 sm:grid-cols-4">
                            <Card
                                onClick={() => setActiveTab('settings')}
                                className="h-full hover:shadow-lg hover:scale-102 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 cursor-pointer group bg-white dark:bg-surface-800"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <HiOutlineUser className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Update Profile</h3>
                                <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">Modify contact parameters, bio details, and local LGA chapter info.</p>
                            </Card>

                            <Card
                                onClick={() => setIsCardOpen(true)}
                                className="h-full hover:shadow-lg hover:scale-102 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 cursor-pointer group bg-white dark:bg-surface-800"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 dark:bg-accent-950 text-accent-600 dark:text-accent-400 group-hover:bg-accent-600 group-hover:text-white transition-colors">
                                    <HiOutlineIdentification className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-surface-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">Membership ID</h3>
                                <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">View and download your digital membership credential card.</p>
                            </Card>

                            <Card
                                onClick={() => setIsResourcesOpen(true)}
                                className="h-full hover:shadow-lg hover:scale-102 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 cursor-pointer group bg-white dark:bg-surface-800"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <HiOutlineDocumentText className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-surface-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Resources</h3>
                                <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">Access regulatory guidelines, constitutions, and training files.</p>
                            </Card>

                            <Card
                                onClick={() => setIsSupportOpen(true)}
                                className="h-full hover:shadow-lg hover:scale-102 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 cursor-pointer group bg-white dark:bg-surface-800"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <HiOutlineSupport className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-surface-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Support</h3>
                                <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">Send support queries and credential audits to Katsina chapter office.</p>
                            </Card>
                        </div>
                    </div>

                    {/* Dashboard Split: Recent Activity & Announcements */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Recent Activity Card */}
                        <Card className="md:col-span-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-surface-900 dark:text-white">Recent Activity</h3>
                                <p className="text-xs text-surface-400">Timeline of updates on your membership status</p>
                            </div>
                            <div className="relative border-l border-surface-200 dark:border-surface-700 pl-4 space-y-6 ml-2">
                                <div className="relative">
                                    <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-4 ring-white dark:ring-surface-800">
                                        <HiOutlineCheckCircle className="h-3 w-3 text-white" />
                                    </span>
                                    <p className="text-xs font-semibold text-surface-400">Today</p>
                                    <p className="text-sm font-medium text-surface-850 dark:text-surface-150">Profile settings reviewed and saved</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 ring-4 ring-white dark:ring-surface-800">
                                        <HiOutlineCheckCircle className="h-3 w-3 text-white" />
                                    </span>
                                    <p className="text-xs font-semibold text-surface-400">2 days ago</p>
                                    <p className="text-sm font-medium text-surface-850 dark:text-surface-150">Digital ID Card generated successfully</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 ring-4 ring-white dark:ring-surface-800">
                                        <HiOutlineCheckCircle className="h-3 w-3 text-white" />
                                    </span>
                                    <p className="text-xs font-semibold text-surface-400">1 week ago</p>
                                    <p className="text-sm font-medium text-surface-850 dark:text-surface-150">Annual membership dues verified by Admin</p>
                                </div>
                            </div>
                        </Card>

                        {/* Katsina Chapter Announcements */}
                        <Card className="bg-gradient-to-br from-accent-50/20 to-primary-50/20 dark:from-accent-950/10 dark:to-primary-950/10 border border-surface-200 dark:border-surface-800">
                            <h3 className="text-base font-bold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                                <HiOutlineBell className="text-accent-600 dark:text-accent-400 h-5 w-5" />
                                Official News
                            </h3>
                            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed mb-4">
                                The Katsina State CHEW Executive Committee has announced dates for the upcoming state-wide primary immunization drive. Members participating will earn priority CEU credits.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                fullWidth
                                onClick={() => setActiveTab('notifications')}
                            >
                                Read Announcements
                            </Button>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'notifications' && (
                <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 max-w-4xl mx-auto p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-800 mb-6 gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-surface-900 dark:text-white">Notifications Center</h2>
                            <p className="text-xs text-surface-400 mt-1">Manage system alerts, mandatory reminders, and local announcements</p>
                        </div>
                        <div className="flex gap-2">
                            {notifications.length > 0 && (
                                <>
                                    <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                                        Mark All Read
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={clearAllNotifications} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                                        Clear All
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`relative p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                                        n.read
                                            ? 'bg-surface-50/50 dark:bg-surface-900/30 border-surface-200 dark:border-surface-800 opacity-75'
                                            : 'bg-primary-50/20 dark:bg-primary-950/10 border-primary-100 dark:border-primary-900/40 shadow-sm'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-semibold ${n.read ? 'text-surface-700 dark:text-surface-300' : 'text-surface-900 dark:text-white'}`}>
                                                {n.title}
                                            </h4>
                                            {!n.read && (
                                                <Badge variant="blue" className="px-1.5 py-0.2">New</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-surface-500 dark:text-surface-450 mt-1 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <span className="text-[10px] text-surface-400 mt-2 block">{n.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleNotificationRead(n.id)}
                                            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                            title={n.read ? 'Mark as Unread' : 'Mark as Read'}
                                        >
                                            <HiOutlineCheckCircle className={`h-5 w-5 ${n.read ? 'text-green-500' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => dismissNotification(n.id)}
                                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 dark:text-surface-500 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                                            title="Delete Alert"
                                        >
                                            <HiOutlineTrash className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 text-surface-400 mb-3">
                                <HiOutlineBell className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">All caught up!</h3>
                            <p className="text-xs text-surface-450 mt-1">You have zero new notifications.</p>
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Settings sections */}
                    <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 p-6">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Profile Management</h2>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Input
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <Select
                                    label="LGA Chapter"
                                    value={lga}
                                    onChange={(e) => setLga(e.target.value)}
                                    options={katsinaLGAs}
                                />
                                <Input
                                    label="State"
                                    value="Katsina State"
                                    disabled
                                    className="opacity-75"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Profile Biography</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-150 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="Write details about your clinical experience..."
                                    required
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <Button type="submit">Save Changes</Button>
                                {isProfileSaved && (
                                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
                                        <HiOutlineCheckCircle className="h-5 w-5" />
                                        Profile saved successfully!
                                    </span>
                                )}
                            </div>
                        </form>
                    </Card>

                    {/* Change Password Card */}
                    <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 p-6">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Security Settings</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="grid gap-6 sm:grid-cols-3">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    error={passwordError && !newPassword ? passwordError : undefined}
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={passwordError && newPassword !== confirmPassword ? passwordError : undefined}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <Button type="submit" variant="outline" loading={isPasswordLoading}>
                                    Change Password
                                </Button>
                                {passwordSuccess && (
                                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-1.5">
                                        <HiOutlineCheckCircle className="h-5 w-5" />
                                        {passwordSuccess}
                                    </span>
                                )}
                            </div>
                        </form>
                    </Card>

                    {/* Preferences & Theme Settings */}
                    <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 p-6">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">System Preferences</h2>
                        <div className="space-y-6">
                            {/* Theme switcher */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Interface Theme</h4>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Configure whether you prefer the dashboard dark or light mode.</p>
                                </div>
                                <div className="flex gap-2 mt-3 sm:mt-0 bg-surface-100 dark:bg-surface-900 p-1.5 rounded-lg border border-surface-200 dark:border-surface-800">
                                    <button
                                        onClick={() => handleThemeToggle('light')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                            theme === 'light'
                                                ? 'bg-white dark:bg-surface-800 text-primary-600 dark:text-white shadow-sm'
                                                : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <HiOutlineSun className="h-4 w-4" />
                                        Light
                                    </button>
                                    <button
                                        onClick={() => handleThemeToggle('dark')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                            theme === 'dark'
                                                ? 'bg-white dark:bg-surface-800 text-primary-650 dark:text-white shadow-sm'
                                                : 'text-surface-500 hover:text-surface-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <HiOutlineMoon className="h-4 w-4" />
                                        Dark
                                    </button>
                                </div>
                            </div>

                            {/* Notifications channels */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Channel Subscriptions</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">Email Notifications</p>
                                        <p className="text-[11px] text-surface-450">Receive monthly newsletters, immunization updates, and support answers.</p>
                                    </div>
                                    <button
                                        onClick={() => handlePreferenceToggle('email')}
                                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                                            emailAlerts ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-700'
                                        }`}
                                    >
                                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                                            emailAlerts ? 'right-1' : 'left-1'
                                        }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">SMS Compliance Alerts</p>
                                        <p className="text-[11px] text-surface-450">Receive urgent state reminders and renewal deadlines on your mobile phone.</p>
                                    </div>
                                    <button
                                        onClick={() => handlePreferenceToggle('sms')}
                                        className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                                            smsAlerts ? 'bg-primary-600' : 'bg-surface-300 dark:bg-surface-700'
                                        }`}
                                    >
                                        <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                                            smsAlerts ? 'right-1' : 'left-1'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* MODALS */}

            {/* Modal: Membership ID Card */}
            {isCardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fadeIn">
                    <Card className="w-full max-w-lg bg-white dark:bg-surface-800 p-6 relative">
                        <button
                            onClick={() => setIsCardOpen(false)}
                            className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 p-1.5 rounded-lg transition-colors"
                        >
                            <HiOutlineX className="h-5 w-5" />
                        </button>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Digital Member ID</h3>
                        <p className="text-xs text-surface-450 mb-6">Scan QR code or present this card to verify state CHEW compliance status.</p>

                        {/* ID Card Box */}
                        <div className="mx-auto w-full max-w-sm rounded-2xl bg-gradient-to-br from-primary-600 to-accent-700 p-6 text-white shadow-xl relative overflow-hidden aspect-[1.586/1]">
                            {/* Watermark/SVG overlay */}
                            <div className="absolute inset-0 opacity-10">
                                <svg className="h-full w-full" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <circle cx="200" cy="125" r="120" fill="none" stroke="white" strokeWidth="2" />
                                    <circle cx="200" cy="125" r="80" fill="none" stroke="white" strokeWidth="2" />
                                </svg>
                            </div>

                            <div className="relative h-full flex flex-col justify-between">
                                {/* Top card line */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Katsina State Chapter</p>
                                        <h4 className="text-base font-extrabold tracking-wide">KYCHEW MEMBER</h4>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-[10px] border border-white/20">
                                        KYC
                                    </div>
                                </div>

                                {/* Main details / photo block */}
                                <div className="flex items-center gap-4 my-2">
                                    {/* Avatar image / initials */}
                                    <div className="h-16 w-16 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center text-xl font-bold backdrop-blur-sm shadow-md shrink-0">
                                        {initials}
                                    </div>

                                    {/* Member info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold truncate">{fullName}</p>
                                        <p className="text-[10px] opacity-90 truncate">License: {membershipId}</p>
                                        <p className="text-[10px] opacity-90 truncate">Chapter: {lga} LGA</p>
                                        <p className="text-[10px] font-bold mt-1 inline-flex items-center gap-1 bg-green-500/80 px-2 py-0.5 rounded-full text-[9px]">
                                            <HiOutlineCheckCircle className="h-3 w-3" /> VERIFIED
                                        </p>
                                    </div>

                                    {/* QR Code */}
                                    <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-md">
                                        <QRCode value={membershipId} size={48} />
                                    </div>
                                </div>

                                {/* Bottom expiry status */}
                                <div className="flex justify-between items-end text-[9px] opacity-75 border-t border-white/10 pt-2">
                                    <p>Issued: June 2026</p>
                                    <p>Expires: October 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsCardOpen(false)}>
                                Close
                            </Button>
                            <Button onClick={() => window.print()}>
                                Print Card
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal: Resources Downloads */}
            {isResourcesOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fadeIn">
                    <Card className="w-full max-w-xl bg-white dark:bg-surface-800 p-6 relative">
                        <button
                            onClick={() => setIsResourcesOpen(false)}
                            className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 p-1.5 rounded-lg transition-colors"
                        >
                            <HiOutlineX className="h-5 w-5" />
                        </button>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Resource Library</h3>
                        <p className="text-xs text-surface-450 mb-6">Download state guidelines, official code, and regulatory reference documents.</p>

                        <div className="space-y-4">
                            {resourcesList.map((res) => {
                                const isDownloading = downloadingId === res.id;
                                const isDownloaded = downloadedIds.includes(res.id);

                                return (
                                    <div key={res.id} className="flex items-center justify-between p-3 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/20">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{res.title}</p>
                                            <p className="text-[11px] text-surface-450 mt-1">{res.size} • PDF Document</p>
                                        </div>
                                        <Button
                                            variant={isDownloaded ? 'ghost' : 'outline'}
                                            size="sm"
                                            onClick={() => handleDownloadResource(res.id)}
                                            disabled={isDownloading || isDownloaded}
                                            className="shrink-0"
                                        >
                                            {isDownloading ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                                                    Fetching
                                                </span>
                                            ) : isDownloaded ? (
                                                <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-bold">
                                                    <HiOutlineCheckCircle className="h-4 w-4" />
                                                    Downloaded
                                                </span>
                                            ) : (
                                                'Download'
                                            )}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={() => setIsResourcesOpen(false)}>
                                Done
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Modal: Katsina Support Contacts */}
            {isSupportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fadeIn">
                    <Card className="w-full max-w-xl bg-white dark:bg-surface-800 p-6 relative">
                        <button
                            onClick={() => {
                                setIsSupportOpen(false);
                                setSupportSuccess(false);
                                setSupportMessage('');
                            }}
                            className="absolute top-4 right-4 text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 p-1.5 rounded-lg transition-colors"
                        >
                            <HiOutlineX className="h-5 w-5" />
                        </button>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Contact Katsina Support</h3>
                        <p className="text-xs text-surface-450 mb-6">Send messages directly to the state registry office for license compliance or audit inquiries.</p>

                        {!supportSuccess ? (
                            <form onSubmit={handleSupportSubmit} className="space-y-4">
                                <Select
                                    label="Support Topic"
                                    value={supportSubject}
                                    onChange={(e) => setSupportSubject(e.target.value)}
                                    options={[
                                        { value: 'License Verification', label: 'License Verification Query' },
                                        { value: 'ID Card Corrections', label: 'ID Card Corrections' },
                                        { value: 'Annual Dues Issues', label: 'Annual Dues / Receipt Issues' },
                                        { value: 'General Chapter Support', label: 'General Chapter Enquiries' },
                                    ]}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Message / Inquiry Details</label>
                                    <textarea
                                        value={supportMessage}
                                        onChange={(e) => setSupportMessage(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-150 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        placeholder="Describe your enquiry in detail..."
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 items-center justify-end pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsSupportOpen(false);
                                            setSupportMessage('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" loading={isSupportLoading}>
                                        Submit Ticket
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 mb-4">
                                    <HiOutlineCheckCircle className="h-6 w-6" />
                                </div>
                                <h4 className="text-base font-bold text-surface-900 dark:text-white">Ticket Submitted Successfully!</h4>
                                <p className="text-xs text-surface-450 mt-1.5 max-w-sm mx-auto leading-relaxed">
                                    Your support request has been logged. The Katsina State CHEW registrar will contact you via email or phone within 48 hours.
                                </p>
                                <div className="mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsSupportOpen(false);
                                            setSupportSuccess(false);
                                            setSupportMessage('');
                                        }}
                                    >
                                        Close Window
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-surface-200 dark:border-surface-800 mt-6 pt-4 grid grid-cols-2 gap-4 text-xs text-surface-500 dark:text-surface-400">
                            <div className="flex items-center gap-2">
                                <HiOutlineMail className="h-4 w-4 text-primary-500" />
                                <span>katsina@kychew.org.ng</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HiOutlinePhone className="h-4 w-4 text-accent-500" />
                                <span>+234 803 762 9012</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
