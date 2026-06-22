import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getPaymentStatus } from '@/services/paymentService';
import Card from '@/components/common/Card';
import RegenerateModal from '@/features/IDCard/components/RegenerateModal';
import {
    HiOutlineIdentification,
    HiOutlineEye,
    HiOutlineDownload,
    HiOutlineCheckCircle,
    HiOutlineClock,
} from 'react-icons/hi';

export default function IDCardDashboard() {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const [cardExists, setCardExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showRegenModal, setShowRegenModal] = useState(false);

    // Check if a card has been generated (payment completed = card exists)
    useEffect(() => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }
        const checkCardStatus = async () => {
            try {
                const status = await getPaymentStatus(currentUser.uid);
                setCardExists(status === 'completed');
            } catch {
                setCardExists(false);
            }
            setLoading(false);
        };
        checkCardStatus();
    }, [currentUser?.uid]);

    const handleGenerateClick = () => {
        if (cardExists) {
            setShowRegenModal(true);
        } else {
            navigate(ROUTE_PATHS.ID_CARD_GENERATE);
        }
    };

    const handleRegenConfirm = () => {
        setShowRegenModal(false);
        navigate(ROUTE_PATHS.ID_CARD_GENERATE);
    };

    const handleViewClick = () => {
        if (cardExists) {
            navigate(ROUTE_PATHS.ID_CARD_VIEW);
        }
    };

    const handleDownloadClick = () => {
        if (cardExists) {
            navigate(ROUTE_PATHS.ID_CARD_DOWNLOAD);
        }
    };

    const initials = userProfile?.fullName
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ID';

    return (
        <div className="space-y-8 animate-fadeIn">
            <style>{`
                @keyframes idcard-dash-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                .idcard-dash-float {
                    animation: idcard-dash-float 3s ease-in-out infinite;
                }
                .action-card-disabled {
                    opacity: 0.5;
                    pointer-events: none;
                    filter: grayscale(0.3);
                }
            `}</style>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-700 dark:to-accent-700 px-6 py-10 sm:px-8 sm:py-12 shadow-lg">
                {/* Decorative circles */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="100" cy="50" r="80" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="700" cy="350" r="100" fill="none" stroke="white" strokeWidth="1" />
                        <circle cx="400" cy="200" r="60" fill="none" stroke="white" strokeWidth="0.5" />
                    </svg>
                </div>
                <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white backdrop-blur-sm border border-white/25 idcard-dash-float">
                        {initials}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                            ID Card Management
                        </h1>
                        <p className="mt-2 text-sm text-primary-100 max-w-xl">
                            Generate, preview, and download your professional community health worker ID card. Manage your digital credential from one place.
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Banner */}
            {!loading && (
                <div className={`flex items-center gap-3 rounded-xl border px-5 py-4 transition-all ${
                    cardExists
                        ? 'bg-accent-50/60 dark:bg-accent-950/20 border-accent-200 dark:border-accent-800'
                        : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                }`}>
                    {cardExists ? (
                        <>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/40">
                                <HiOutlineCheckCircle className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-accent-800 dark:text-accent-300">ID Card Generated</p>
                                <p className="text-xs text-accent-600 dark:text-accent-400">Your card is ready to view and download.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                                <HiOutlineClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">No ID Card Yet</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400">Generate your ID card to get started.</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Action Cards Grid */}
            <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Actions</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                    {/* Generate Card */}
                    <Card
                        onClick={handleGenerateClick}
                        className="h-full hover:shadow-lg hover:scale-102 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 cursor-pointer group bg-white dark:bg-surface-800"
                    >
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                <HiOutlineIdentification className="h-7 w-7" />
                            </div>
                            <h3 className="mt-5 text-base font-bold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {cardExists ? 'Regenerate' : 'Generate'} ID Card
                            </h3>
                            <p className="mt-2 text-xs text-surface-500 dark:text-surface-400 leading-relaxed max-w-[200px]">
                                {cardExists
                                    ? 'Create a new version of your member ID card'
                                    : 'Create a new member ID card with your details'}
                            </p>
                        </div>
                    </Card>

                    {/* View Card */}
                    <Card
                        onClick={handleViewClick}
                        className={`h-full transition-all duration-300 bg-white dark:bg-surface-800 ${
                            cardExists
                                ? 'hover:shadow-lg hover:scale-102 hover:border-accent-300 dark:hover:border-accent-700 cursor-pointer group'
                                : 'action-card-disabled'
                        }`}
                    >
                        <div className="flex flex-col items-center text-center py-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                                cardExists
                                    ? 'bg-accent-100 dark:bg-accent-950 text-accent-600 dark:text-accent-400 group-hover:bg-accent-600 group-hover:text-white'
                                    : 'bg-surface-100 dark:bg-surface-800 text-surface-400'
                            }`}>
                                <HiOutlineEye className="h-7 w-7" />
                            </div>
                            <h3 className={`mt-5 text-base font-bold transition-colors ${
                                cardExists
                                    ? 'text-surface-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400'
                                    : 'text-surface-400'
                            }`}>
                                View ID Card
                            </h3>
                            <p className="mt-2 text-xs text-surface-500 dark:text-surface-400 leading-relaxed max-w-[200px]">
                                Preview your current member ID card
                            </p>
                            {!cardExists && (
                                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-[10px] font-semibold text-surface-400 uppercase tracking-wider">
                                    No card yet
                                </span>
                            )}
                        </div>
                    </Card>

                    {/* Download Card */}
                    <Card
                        onClick={handleDownloadClick}
                        className={`h-full transition-all duration-300 bg-white dark:bg-surface-800 ${
                            cardExists
                                ? 'hover:shadow-lg hover:scale-102 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer group'
                                : 'action-card-disabled'
                        }`}
                    >
                        <div className="flex flex-col items-center text-center py-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                                cardExists
                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white'
                                    : 'bg-surface-100 dark:bg-surface-800 text-surface-400'
                            }`}>
                                <HiOutlineDownload className="h-7 w-7" />
                            </div>
                            <h3 className={`mt-5 text-base font-bold transition-colors ${
                                cardExists
                                    ? 'text-surface-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'
                                    : 'text-surface-400'
                            }`}>
                                Download ID Card
                            </h3>
                            <p className="mt-2 text-xs text-surface-500 dark:text-surface-400 leading-relaxed max-w-[200px]">
                                Save your card as PDF or image file
                            </p>
                            {!cardExists && (
                                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-[10px] font-semibold text-surface-400 uppercase tracking-wider">
                                    No card yet
                                </span>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Quick Info */}
            {cardExists && userProfile && (
                <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-surface-900 dark:text-white">Card Details</h3>
                        <p className="text-xs text-surface-400">Summary of your generated ID card</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            { label: 'Full Name', value: userProfile.fullName },
                            { label: 'Member ID', value: userProfile.membershipId },
                            { label: 'Role', value: userProfile.userType },
                        ].map((item) => (
                            <div key={item.label} className="rounded-lg bg-surface-50 dark:bg-surface-900 p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">{item.label}</p>
                                <p className="mt-1 text-sm font-semibold text-surface-800 dark:text-surface-200">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Regenerate Modal */}
            <RegenerateModal
                isOpen={showRegenModal}
                onClose={() => setShowRegenModal(false)}
                onConfirm={handleRegenConfirm}
            />
        </div>
    );
}
