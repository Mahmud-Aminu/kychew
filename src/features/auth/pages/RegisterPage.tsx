import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAuth } from '@/hooks/useAuth';
import type { AuthFormData, AuthFormErrors } from '@/features/auth/types';
import { HiOutlineViewGrid, HiOutlineBriefcase, HiOutlineIdentification, HiOutlineUser, HiOutlineExclamationCircle, HiOutlineX } from 'react-icons/hi';
import kychewLogo from '@/assets/kychew-logo.png';
import { useNavigate } from 'react-router';



function validate(data: AuthFormData, isLogin: boolean): AuthFormErrors {
    const errors: AuthFormErrors = {};
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        errors.email = 'Enter a valid email address';
    if (!data.password) errors.password = 'Password is required';
    else if (!isLogin && data.password.length < 8)
        errors.password = 'Must be at least 8 characters';
    if (!isLogin) {
        if (!data.confirmPassword)
            errors.confirmPassword = 'Please confirm your password';
        else if (data.password !== data.confirmPassword)
            errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
}

export default function AuthPage() {
    const location = useLocation();
    const isLogin = location.pathname === ROUTE_PATHS.LOGIN;

    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<AuthFormErrors>({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const { login, register, currentUser } = useAuth();
    const navigate = useNavigate();



    useEffect(() => {
        if (currentUser && !isLogin) {
            navigate(ROUTE_PATHS.ONBOARDING);
        }

        if (currentUser && isLogin) {
            navigate(ROUTE_PATHS.DASHBOARD);
        }
    }, [currentUser, isLogin, navigate]);
    const handleChange = (field: keyof AuthFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (serverError) setServerError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setServerError(null);
        const formErrors = validate(formData, isLogin);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);

            } else {
                await register(formData.email, formData.password);

            }
        } catch (err: unknown) {
            console.error("Authentication error", err);
            setServerError(err instanceof Error ? err.message : "Failed to authenticate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Left panel — decorative */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-accent-800 lg:flex lg:flex-col lg:justify-between">
                {/* Decorative circles */}
                <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
                <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/5" />
                <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-accent-500/10" />

                <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
                    <div className="flex items-center gap-3">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm overflow-hidden">
                            <img src={kychewLogo} alt="KYChew logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            KY<span className="text-accent-300">Chew</span>
                        </span>
                    </div>

                    <h2 className="mt-10 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                        {isLogin ? (
                            <>
                                Welcome back to
                                <br />
                                your{' '}
                                <span className="text-accent-300">community</span>
                            </>
                        ) : (
                            <>
                                Join a growing
                                <br />
                                community of{' '}
                                <span className="text-accent-300">health workers</span>
                            </>
                        )}
                    </h2>
                    <p className="mt-5 max-w-md text-lg leading-relaxed text-primary-200">
                        {isLogin
                            ? 'Sign in to access your dashboard, track jobs, and manage your professional profile.'
                            : 'Get your professional ID, discover opportunities, and connect with fellow health workers across Katsina State.'}
                    </p>

                    {/* Highlights */}
                    <div className="mt-10 space-y-4">
                        {(isLogin
                            ? [
                                { icon: HiOutlineViewGrid, text: 'View your personalized dashboard' },
                                { icon: HiOutlineBriefcase, text: 'Track your job applications' },
                                { icon: HiOutlineIdentification, text: 'Download your digital ID card' },
                            ]
                            : [
                                { icon: HiOutlineIdentification, text: 'Professional digital ID card' },
                                { icon: HiOutlineBriefcase, text: 'Access to health sector jobs' },
                                { icon: HiOutlineUser, text: 'Build your professional profile' },
                            ]
                        ).map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.text} className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                        <Icon className="h-5 w-5 text-accent-300" aria-hidden="true" />
                                    </div>
                                    <span className="text-sm font-medium text-white/90">
                                        {item.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10 border-t border-white/10 px-12 py-6 xl:px-16">
                    <div className="flex gap-8">
                        {[
                            { value: '2,500+', label: 'Members' },
                            { value: '150+', label: 'Partners' },
                            { value: '98%', label: 'ID Approval' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-primary-300">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-600">
                            <span className="text-lg font-bold text-white">K</span>
                        </div>
                        <span className="text-xl font-bold text-surface-900">
                            KY<span className="text-accent-600">Chew</span>
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-surface-900">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p className="mt-2 text-surface-500">
                        {isLogin
                            ? 'Sign in to your KYChew account.'
                            : 'Start your journey with KYChew in seconds.'}
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-5"
                    >
                        {serverError && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-[fadeIn_0.25s_ease-out]">
                                <HiOutlineExclamationCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                <p className="flex-1 text-sm font-medium text-red-700">
                                    {serverError}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setServerError(null)}
                                    className="shrink-0 rounded-lg p-0.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                                    aria-label="Dismiss error"
                                >
                                    <HiOutlineX className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            error={errors.email}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder={isLogin ? 'Enter your password' : 'Min. 8 characters'}
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            error={errors.password}
                            helperText={
                                !isLogin && !errors.password && formData.password.length > 0
                                    ? formData.password.length >= 8
                                        ? '✓ Strong enough'
                                        : `${8 - formData.password.length} more characters needed`
                                    : undefined
                            }
                            required
                        />

                        {/* Login extras */}
                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-surface-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Confirm password — register only */}
                        {!isLogin && (
                            <Input
                                label="Confirm password"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    handleChange('confirmPassword', e.target.value)
                                }
                                error={errors.confirmPassword}
                                required
                            />
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            size="lg"
                            className="mt-2"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-surface-50 px-3 text-xs text-surface-400">
                                or
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-surface-500">
                        {isLogin ? (
                            <>
                                Don&#39;t have an account?{' '}
                                <Link
                                    to={ROUTE_PATHS.REGISTER}
                                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Link
                                    to={ROUTE_PATHS.LOGIN}
                                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </p>

                    {!isLogin && (
                        <p className="mt-6 text-center text-xs leading-relaxed text-surface-400">
                            By creating an account you agree to our{' '}
                            <span className="underline cursor-pointer hover:text-surface-600">
                                Terms of Service
                            </span>{' '}
                            and{' '}
                            <span className="underline cursor-pointer hover:text-surface-600">
                                Privacy Policy
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
