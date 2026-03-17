import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTE_PATHS } from '@/routes/routePaths';

import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

import HomePage from '@/pages/Home/HomePage';
import AuthPage from '@/features/auth/pages/RegisterPage';
import OnboardingPage from '@/features/auth/pages/OnboardingPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import JobsPage from '@/pages/Jobs/JobsPage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import IDCardPage from '@/pages/IDCard/IDCardPage';
import AboutPage from '@/pages/About/AboutPage';
import ContactPage from '@/pages/Contact/ContactPage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import AuthLayout from '@/components/layout/AuthLayout';

function ProtectedRoute() {
    const { currentUser, loading } = useAuth();
    console.log("ProtectedRoute - currentUser:", currentUser, "loading:", loading);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600"></div>
                    <p className="text-surface-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
    }

    return <Outlet />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route element={<PublicLayout />}>
                    <Route path={ROUTE_PATHS.HOME} element={<HomePage />} />
                    <Route path={ROUTE_PATHS.ABOUT} element={<AboutPage />} />
                    <Route path={ROUTE_PATHS.CONTACTS} element={<ContactPage />} />
                </Route>

                {/* Auth routes */}
                <Route element={<AuthLayout />}>
                    <Route path={ROUTE_PATHS.LOGIN} element={<AuthPage />} />
                    <Route path={ROUTE_PATHS.REGISTER} element={<AuthPage />} />

                </Route>
                <Route path={ROUTE_PATHS.ONBOARDING} element={<OnboardingPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>

                        <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
                        <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
                        <Route path={ROUTE_PATHS.ID_CARD} element={<IDCardPage />} />
                        <Route path={ROUTE_PATHS.JOBS} element={<JobsPage />} />
                    </Route>
                </Route>

                {/* Not found */}
                <Route element={<PublicLayout />}>
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
