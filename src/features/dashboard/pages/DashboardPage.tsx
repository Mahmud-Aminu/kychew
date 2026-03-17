import { Link } from 'react-router';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/hooks/useAuth';
import { HiOutlineBriefcase, HiOutlineIdentification, HiOutlineUser, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

const quickActions = [
    { label: 'Browse Jobs', path: ROUTE_PATHS.JOBS, icon: HiOutlineBriefcase, description: 'Find health sector opportunities' },
    { label: 'Get ID Card', path: ROUTE_PATHS.ID_CARD, icon: HiOutlineIdentification, description: 'Generate your digital ID' },
    { label: 'Update Profile', path: ROUTE_PATHS.PROFILE, icon:HiOutlineUser, description: 'Complete your profile & CV' },
];

export default function DashboardPage() {
    const { userProfile } = useAuth()

    const displayName = userProfile?.fullName || 'User';
    const initials = displayName.split(' ').map((n) => n[0]).join('');

    return (
        <div className="space-y-8">
            {/* Welcome Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-12 sm:px-8 sm:py-16">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="100" cy="50" r="80" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="700" cy="350" r="100" fill="none" stroke="white" strokeWidth="1" />
                    </svg>
                </div>
                <div className="relative flex items-center gap-4 sm:gap-6">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                        {initials}
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Welcome back, {displayName}! 👋
                        </h1>
                        <p className="mt-2 text-base text-primary-100">
                            Here's your progress and next steps.
                        </p>
                    </div>
                </div>
            </div>

            {/* My Progress Section */}
            <Card className="bg-gradient-to-br from-white to-surface-50">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-surface-900">Profile Completion</h2>
                    <p className="mt-1 text-sm text-surface-500">Complete your profile to unlock more opportunities</p>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Basic Information', completed: true },
                        { label: 'Add Profile Picture', completed: true },
                        { label: 'Add Experience', completed: false },
                        { label: 'Upload CV', completed: false },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                    item.completed ? 'bg-green-500 text-white' : 'bg-surface-200'
                                }`}
                            >
                                {item.completed ? (
                                    <HiOutlineCheckCircle className="h-4 w-4" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-surface-400" />
                                )}
                            </div>
                            <span className={`text-sm ${item.completed ? 'text-surface-600' : 'text-surface-500'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-6 border-t border-surface-100">
                    <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-200">
                            <div className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-accent-500" />
                        </div>
                        <span className="text-sm font-medium text-surface-600">50%</span>
                    </div>
                </div>
            </Card>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-surface-900 mb-4">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link to={action.path} key={action.label}>
                                <Card className="h-full bg-gradient-to-br from-white to-surface-50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
                                    <div className="flex flex-col h-full">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600 group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white transition-all duration-300">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">{action.label}</h3>
                                        <p className="mt-2 flex-1 text-sm text-surface-500">{action.description}</p>
                                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:translate-x-1 transition-transform">
                                            Open <span>→</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-white to-surface-50">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-surface-900">Recent Activity</h2>
                        <p className="mt-1 text-sm text-surface-500">Your latest updates and actions</p>
                    </div>
                    <Link to={ROUTE_PATHS.PROFILE}>
                        <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                </div>
                <div className="space-y-0 divide-y divide-surface-100">
                    {[
                        { text: 'ID Card application approved', time: '2 hours ago', icon: HiOutlineCheckCircle, status: 'success' },
                        { text: 'Applied to Community Health Coordinator position', time: '1 day ago', icon: HiOutlineBriefcase, status: 'info' },
                        { text: 'Profile updated successfully', time: '3 days ago', icon: HiOutlineUser, status: 'success' },
                        { text: 'Account created', time: '1 week ago', icon: HiOutlineClock, status: 'info' },
                    ].map((activity, idx) => {
                        const ActivityIcon = activity.icon
                        return (
                            <div key={idx} className="flex items-center gap-4 py-4 hover:bg-surface-50 px-2 rounded-lg transition-colors">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                    activity.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    <ActivityIcon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-surface-800">{activity.text}</p>
                                    <p className="text-xs text-surface-400">{activity.time}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    );
}
