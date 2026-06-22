import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import idConfig from '@/helpers/id.config.json';
import frontBg from '@/assets/front.png';
import backBg from '@/assets/back.png';
import QRCode from 'react-qr-code';
import { useAuth } from '@/hooks/useAuth';
import { getIssueAndExpiryDate } from '@/helpers/helpers';
import { getPaymentStatus } from '@/services/paymentService';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
    HiOutlineArrowLeft,
    HiOutlineDownload,
    HiOutlineRefresh,
} from 'react-icons/hi';

export default function IDCardView() {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const { issueDate, expiryDate } = getIssueAndExpiryDate();
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardExists, setCardExists] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser?.uid) {
            setLoading(false);
            return;
        }
        const check = async () => {
            try {
                const status = await getPaymentStatus(currentUser.uid);
                setCardExists(status === 'completed');
            } catch {
                setCardExists(false);
            }
            setLoading(false);
        };
        check();
    }, [currentUser?.uid]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600" />
                    <p className="text-surface-600">Loading…</p>
                </div>
            </div>
        );
    }

    if (!cardExists) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <button
                    onClick={() => navigate(ROUTE_PATHS.ID_CARD)}
                    className="flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
                >
                    <HiOutlineArrowLeft className="h-4 w-4" />
                    Back to ID Card
                </button>
                <Card className="text-center py-16">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800 text-surface-400 mb-4">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-surface-900 dark:text-white">No ID Card Found</h2>
                    <p className="mt-2 text-sm text-surface-500 max-w-sm mx-auto">
                        You haven't generated an ID card yet. Generate one first to preview it here.
                    </p>
                    <Button className="mt-6" onClick={() => navigate(ROUTE_PATHS.ID_CARD_GENERATE)}>
                        Generate ID Card
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <style>{`
                .card-flip-container {
                    perspective: 1000px;
                }
                .card-flip-inner {
                    position: relative;
                    transition: transform 0.6s ease-in-out;
                    transform-style: preserve-3d;
                }
                .card-flip-inner.flipped {
                    transform: rotateY(180deg);
                }
                .card-side {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .card-front {
                    transform: rotateY(0deg);
                }
                .card-back {
                    transform: rotateY(180deg);
                }
            `}</style>

            {/* Back nav */}
            <button
                onClick={() => navigate(ROUTE_PATHS.ID_CARD)}
                className="flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
            >
                <HiOutlineArrowLeft className="h-4 w-4" />
                Back to ID Card
            </button>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">ID Card Preview</h1>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                    View your generated member ID card. Click the card or use the button to flip between front and back.
                </p>
            </div>

            {/* Card Preview */}
            <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800">
                <div className="flex flex-col items-center gap-6 py-4">
                    {/* Flip Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="flex items-center gap-2"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                        </svg>
                        {isFlipped ? 'View Front' : 'View Back'}
                    </Button>

                    {/* 3D Flip Card */}
                    <div
                        className="card-flip-container cursor-pointer"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>
                            {/* Front Side */}
                            <div
                                className="card-side card-front"
                                style={{
                                    width: `${idConfig.card.dimensions.width / 3}px`,
                                    height: `${idConfig.card.dimensions.height / 3}px`,
                                }}
                            >
                                <div
                                    className="overflow-hidden rounded-xl shadow-lg h-full"
                                    style={{
                                        backgroundImage: `url(${frontBg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Photo */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: `${idConfig.front.memberPhoto.position.x / 2.9}px`,
                                            top: `${idConfig.front.memberPhoto.position.y / 1.5}px`,
                                            width: `${idConfig.front.memberPhoto.position.width / 3}px`,
                                            height: `${idConfig.front.memberPhoto.position.height / 3}px`,
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: `4px solid ${idConfig.front.photoFrame.borderColor}`,
                                            backgroundColor: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: '#666',
                                        }}
                                    >
                                        {userProfile?.avatarUrl ? (
                                            <img src={userProfile.avatarUrl} style={{ width: '140%', height: '140%', objectFit: 'cover' }} />
                                        ) : (
                                            <span className="text-2xl">{userProfile?.fullName?.charAt(0)}</span>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            width: '100%',
                                            top: `${idConfig.front.memberName.position.y / 3}px`,
                                            textAlign: 'center',
                                            color: idConfig.front.memberName.color,
                                            fontSize: '15px',
                                            fontWeight: '700',
                                            paddingLeft: '4px',
                                            paddingRight: '4px',
                                        }}
                                    >
                                        {userProfile?.fullName}
                                    </div>

                                    {/* Role Badge */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            top: `${idConfig.front.roleBadge.position.y / 4}px`,
                                            backgroundColor: idConfig.front.roleBadge.background,
                                            color: idConfig.front.roleBadge.text.color,
                                            padding: '1px 8px',
                                            borderRadius: '9px',
                                            fontSize: '8px',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {userProfile?.userType}
                                    </div>

                                    {/* Details */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: `${idConfig.front.details.position.x / 1}px`,
                                            bottom: `${idConfig.front.details.position.y / 7.6}px`,
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        <div style={{ marginBottom: '4px', color: idConfig.front.details.color }}>
                                            Phone No: {userProfile?.phone || '08065550000'}
                                        </div>
                                        <div style={{ marginBottom: '4px', color: idConfig.front.details.color }}>
                                            Reg No: {userProfile?.membershipId}
                                        </div>
                                        <div style={{ color: idConfig.front.details.color }}>
                                            L.G.A: {userProfile?.lga}
                                        </div>
                                    </div>

                                    {/* Signature */}
                                    {userProfile?.signatureUrl && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: '20px',
                                                bottom: '25px',
                                                width: '50px',
                                                height: '25px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <img
                                                src={userProfile.signatureUrl}
                                                style={{
                                                    width: '100%',
                                                    height: '18px',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                            <span style={{ fontSize: '4px', color: '#64748b', marginTop: '1px' }}>Signature</span>
                                        </div>
                                    )}

                                    {/* QR Code */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: `${idConfig.front.barcode.position.x / 3}px`,
                                            bottom: `${idConfig.front.barcode.position.y / 3}px`,
                                            width: `${idConfig.front.barcode.position.width / 3}px`,
                                            height: `${idConfig.front.barcode.position.height / 3}px`,
                                        }}
                                    >
                                        <QRCode
                                            value={`${userProfile?.fullName},${userProfile?.userType}`}
                                            size={idConfig.front.barcode.position.width / 3}
                                            fgColor={idConfig.front.barcode.colors.dark}
                                            bgColor={idConfig.front.barcode.colors.light}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Back Side */}
                            <div
                                className="card-side card-back"
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: `${idConfig.card.dimensions.width / 3}px`,
                                    height: `${idConfig.card.dimensions.height / 3}px`,
                                }}
                            >
                                <div
                                    className="overflow-hidden rounded-xl shadow-lg h-full"
                                    style={{
                                        backgroundImage: `url(${backBg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '15px',
                                            bottom: `${250 / 3}px`,
                                            fontSize: '9px',
                                            color: idConfig.back.dates.issueDate.color || '#111111',
                                        }}
                                    >
                                        <div className="underline font-bold">{issueDate}</div>
                                        <div style={{ fontWeight: '700', marginBottom: '2px' }}>Issue Date</div>
                                    </div>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: '15px',
                                            bottom: `${250 / 3}px`,
                                            fontSize: '9px',
                                            color: idConfig.back.dates.expiredDate.color || '#111111',
                                            textAlign: 'right',
                                        }}
                                    >
                                        <div className="underline font-bold">{expiryDate}</div>
                                        <div style={{ fontWeight: '700', marginBottom: '2px' }}>Expiry Date</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Card Details */}
            <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800">
                <h3 className="text-base font-bold text-surface-900 dark:text-white mb-4">Card Information</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        { label: 'Full Name', value: userProfile?.fullName },
                        { label: 'Member ID', value: userProfile?.membershipId },
                        { label: 'Role', value: userProfile?.userType },
                        { label: 'LGA', value: userProfile?.lga },
                        { label: 'Issue Date', value: issueDate },
                        { label: 'Expiry Date', value: expiryDate },
                    ].map((item) => (
                        <div key={item.label} className="rounded-lg bg-surface-50 dark:bg-surface-900 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">{item.label}</p>
                            <p className="mt-1 text-sm font-semibold text-surface-800 dark:text-surface-200">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => navigate(ROUTE_PATHS.ID_CARD_DOWNLOAD)} className="flex-1">
                    <HiOutlineDownload className="h-4 w-4" />
                    Download Card
                </Button>
                <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.ID_CARD_GENERATE)} className="flex-1">
                    <HiOutlineRefresh className="h-4 w-4" />
                    Regenerate Card
                </Button>
            </div>
        </div>
    );
}
