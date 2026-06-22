import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import idConfig from '@/helpers/id.config.json';
import frontBg from '@/assets/front.png';
import backBg from '@/assets/back.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'react-qr-code';
import { useAuth } from '@/hooks/useAuth';
import { getIssueAndExpiryDate } from '@/helpers/helpers';
import { getPaymentStatus } from '@/services/paymentService';
import { ROUTE_PATHS } from '@/routes/routePaths';
import {
    HiOutlineArrowLeft,
    HiOutlineDownload,
} from 'react-icons/hi';

export default function IDCardDownload() {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const { issueDate, expiryDate } = getIssueAndExpiryDate();
    const [cardExists, setCardExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [downloadingFront, setDownloadingFront] = useState(false);
    const [downloadingBack, setDownloadingBack] = useState(false);

    const idCardRef = useRef<HTMLDivElement>(null);
    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);

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

    const handleDownloadPDF = async () => {
        if (!idCardRef.current) return;
        setDownloadingPDF(true);
        try {
            const canvas = await html2canvas(idCardRef.current, {
                scale: 4, // High resolution
                useCORS: true,
                backgroundColor: null,
            });

            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            // Create A4 PDF (portrait)
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Convert canvas pixels to ratio
            const imgWidth = pageWidth - 30; // 15mm margin each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const yPosition = (pageHeight - imgHeight) / 2;

            pdf.addImage(imgData, "JPEG", 15, yPosition, imgWidth, imgHeight);
            pdf.save(`ID_Card_${userProfile?.membershipId || 'member'}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to generate PDF. Please try again.");
        }
        setDownloadingPDF(false);
    };

    const handleDownloadPNG = async (side: 'front' | 'back') => {
        const ref = side === 'front' ? frontCardRef : backCardRef;
        const setDownloading = side === 'front' ? setDownloadingFront : setDownloadingBack;
        
        if (!ref.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(ref.current, {
                scale: 4, // High resolution
                useCORS: true,
                backgroundColor: null,
            });

            const imgData = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `ID_Card_${side === 'front' ? 'Front' : 'Back'}_${userProfile?.membershipId || 'member'}.png`;
            link.href = imgData;
            link.click();
        } catch (err) {
            console.error(`${side} PNG download failed:`, err);
            alert(`Failed to download ${side} image. Please try again.`);
        }
        setDownloading(false);
    };

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
                        You haven't generated an ID card yet. Generate one first to download it here.
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
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Download ID Card</h1>
                <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                    Choose your preferred format below to download your member ID card.
                </p>
            </div>

            {/* Download Options Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
                {/* PDF Option */}
                <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 flex flex-col justify-between p-6">
                    <div className="space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-surface-900 dark:text-white">PDF Document</h3>
                            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                                Recommended for printing. Generates a standard A4 PDF containing both the front and back of your card.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button 
                            className="w-full flex items-center justify-center gap-2" 
                            onClick={handleDownloadPDF}
                            disabled={downloadingPDF}
                        >
                            {downloadingPDF ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <HiOutlineDownload className="h-4 w-4" />
                                    Download PDF
                                </>
                            )}
                        </Button>
                    </div>
                </Card>

                {/* PNG Images Option */}
                <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 flex flex-col justify-between p-6">
                    <div className="space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-surface-900 dark:text-white">PNG Images</h3>
                            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                                Best for digital presentation, websites, or messaging. Download high-resolution images of the front and back separately.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Button 
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2" 
                            onClick={() => handleDownloadPNG('front')}
                            disabled={downloadingFront}
                        >
                            {downloadingFront ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <HiOutlineDownload className="h-4 w-4" />
                                    Download Front
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2" 
                            onClick={() => handleDownloadPNG('back')}
                            disabled={downloadingBack}
                        >
                            {downloadingBack ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <HiOutlineDownload className="h-4 w-4" />
                                    Download Back
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Card Preview Visuals for context */}
            <Card className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-800 p-6 text-center">
                <h3 className="text-sm font-semibold text-surface-500 mb-4">Quick View</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                    {/* Front side thumbnail */}
                    <div 
                        className="overflow-hidden rounded-lg shadow border border-surface-200/50"
                        style={{
                            width: `${idConfig.card.dimensions.width / 5}px`,
                            height: `${idConfig.card.dimensions.height / 5}px`,
                            backgroundImage: `url(${frontBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                        }}
                    >
                        {/* Name */}
                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                top: `${idConfig.front.memberName.position.y / 5}px`,
                                textAlign: 'center',
                                color: idConfig.front.memberName.color,
                                fontSize: '9px',
                                fontWeight: '700',
                                paddingLeft: '2px',
                                paddingRight: '2px',
                            }}
                        >
                            {userProfile?.fullName?.split(' ')[0]}
                        </div>

                        {/* Signature thumbnail */}
                        {userProfile?.signatureUrl && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    bottom: '10px',
                                    width: '30px',
                                    height: '15px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={userProfile.signatureUrl}
                                    style={{
                                        width: '100%',
                                        height: '10px',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Back side thumbnail */}
                    <div 
                        className="overflow-hidden rounded-lg shadow border border-surface-200/50"
                        style={{
                            width: `${idConfig.card.dimensions.width / 5}px`,
                            height: `${idConfig.card.dimensions.height / 5}px`,
                            backgroundImage: `url(${backBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </div>
            </Card>

            {/* Hidden offscreen containers for rendering at full resolution */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                {/* Horizontal side-by-side for PDF */}
                <div 
                    ref={idCardRef} 
                    className="flex flex-row gap-10 items-center p-4 bg-white"
                >
                    {/* Front Card */}
                    <div
                        style={{
                            width: `${idConfig.card.dimensions.width}px`,
                            height: `${idConfig.card.dimensions.height}px`,
                            backgroundImage: `url(${frontBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: `${idConfig.front.memberPhoto.position.x}px`,
                                top: `${idConfig.front.memberPhoto.position.y / 0.5}px`,
                                width: `${idConfig.front.memberPhoto.position.width}px`,
                                height: `${idConfig.front.memberPhoto.position.height}px`,
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: `10px solid ${idConfig.front.photoFrame.borderColor}`,
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {userProfile?.avatarUrl ? (
                                <img src={userProfile.avatarUrl} style={{ width: '140%', height: '140%', objectFit: 'cover' }} />
                            ) : (
                                <span className="text-5xl font-bold text-surface-400">{userProfile?.fullName?.charAt(0)}</span>
                            )}
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                width: '100%',
                                top: `${idConfig.front.memberName.position.y}px`,
                                textAlign: 'center',
                                color: idConfig.front.memberName.color,
                                fontSize: '35px',
                                fontWeight: '800',
                            }}
                        >
                            {userProfile?.fullName}
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                top: `${idConfig.front.roleBadge.position.y * 0.9}px`,
                                backgroundColor: idConfig.front.roleBadge.background,
                                color: idConfig.front.roleBadge.text.color,
                                padding: '4px 20px',
                                borderRadius: '24px',
                                fontSize: '20px',
                                fontWeight: '600',
                            }}
                        >
                            {userProfile?.userType}
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                left: `${idConfig.front.details.position.x * 2.3}px`,
                                bottom: `${idConfig.front.details.position.y * 0.9}px`,
                                fontSize: '24px',
                                fontWeight: 'bold',
                                lineHeight: '1.5',
                            }}
                        >
                            <div style={{ color: idConfig.front.details.color }}>
                                Phone No: {userProfile?.phone || '08065550000'}
                            </div>
                            <div style={{ color: idConfig.front.details.color }}>
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
                                    left: '60px',
                                    bottom: '75px',
                                    width: '150px',
                                    height: '75px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={userProfile.signatureUrl}
                                    style={{
                                        width: '100%',
                                        height: '54px',
                                        objectFit: 'contain',
                                    }}
                                />
                                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Signature</span>
                            </div>
                        )}

                        <div
                            style={{
                                position: 'absolute',
                                right: '110px',
                                bottom: '90px',
                                width: `${idConfig.front.barcode.position.width * 1.1}px`,
                                height: `${idConfig.front.barcode.position.height * 1.1}px`,
                            }}
                        >
                            <QRCode
                                value={`${userProfile?.fullName},${userProfile?.userType}`}
                                size={idConfig.front.barcode.position.width * 1.1}
                                fgColor={idConfig.front.barcode.colors.dark}
                                bgColor={idConfig.front.barcode.colors.light}
                            />
                        </div>
                    </div>

                    {/* Back Card */}
                    <div
                        style={{
                            width: `${idConfig.card.dimensions.width}px`,
                            height: `${idConfig.card.dimensions.height}px`,
                            backgroundImage: `url(${backBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: '50px',
                                bottom: '260px',
                                fontSize: '25px',
                                color: idConfig.back.dates.issueDate.color || '#111111',
                            }}
                        >
                            <div className="underline font-bold">{issueDate}</div>
                            <div style={{ fontWeight: '700' }}>Issue Date</div>
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                right: '50px',
                                bottom: '260px',
                                fontSize: '25px',
                                color: idConfig.back.dates.expiredDate.color || '#111111',
                                textAlign: 'right',
                            }}
                        >
                            <div className="underline font-bold">{expiryDate}</div>
                            <div style={{ fontWeight: '700' }}>Expiry Date</div>
                        </div>
                    </div>
                </div>

                {/* Front Card Only */}
                <div
                    ref={frontCardRef}
                    style={{
                        width: `${idConfig.card.dimensions.width}px`,
                        height: `${idConfig.card.dimensions.height}px`,
                        backgroundImage: `url(${frontBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: `${idConfig.front.memberPhoto.position.x}px`,
                            top: `${idConfig.front.memberPhoto.position.y / 0.5}px`,
                            width: `${idConfig.front.memberPhoto.position.width}px`,
                            height: `${idConfig.front.memberPhoto.position.height}px`,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: `10px solid ${idConfig.front.photoFrame.borderColor}`,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {userProfile?.avatarUrl ? (
                            <img src={userProfile.avatarUrl} style={{ width: '140%', height: '140%', objectFit: 'cover' }} />
                        ) : (
                            <span className="text-5xl font-bold text-surface-400">{userProfile?.fullName?.charAt(0)}</span>
                        )}
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            top: `${idConfig.front.memberName.position.y}px`,
                            textAlign: 'center',
                            color: idConfig.front.memberName.color,
                            fontSize: '35px',
                            fontWeight: '800',
                        }}
                    >
                        {userProfile?.fullName}
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: `${idConfig.front.roleBadge.position.y * 0.9}px`,
                            backgroundColor: idConfig.front.roleBadge.background,
                            color: idConfig.front.roleBadge.text.color,
                            padding: '4px 20px',
                            borderRadius: '24px',
                            fontSize: '20px',
                            fontWeight: '600',
                        }}
                    >
                        {userProfile?.userType}
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            left: `${idConfig.front.details.position.x * 2.3}px`,
                            bottom: `${idConfig.front.details.position.y * 0.9}px`,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            lineHeight: '1.5',
                        }}
                    >
                        <div style={{ color: idConfig.front.details.color }}>
                            Phone No: {userProfile?.phone || '08065550000'}
                        </div>
                        <div style={{ color: idConfig.front.details.color }}>
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
                                left: '60px',
                                bottom: '75px',
                                width: '150px',
                                height: '75px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <img
                                src={userProfile.signatureUrl}
                                style={{
                                    width: '100%',
                                    height: '54px',
                                    objectFit: 'contain',
                                }}
                            />
                            <span style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>Signature</span>
                        </div>
                    )}

                    <div
                        style={{
                            position: 'absolute',
                            right: '110px',
                            bottom: '90px',
                            width: `${idConfig.front.barcode.position.width * 1.1}px`,
                            height: `${idConfig.front.barcode.position.height * 1.1}px`,
                        }}
                    >
                        <QRCode
                            value={`${userProfile?.fullName},${userProfile?.userType}`}
                            size={idConfig.front.barcode.position.width * 1.1}
                            fgColor={idConfig.front.barcode.colors.dark}
                            bgColor={idConfig.front.barcode.colors.light}
                        />
                    </div>
                </div>

                {/* Back Card Only */}
                <div
                    ref={backCardRef}
                    style={{
                        width: `${idConfig.card.dimensions.width}px`,
                        height: `${idConfig.card.dimensions.height}px`,
                        backgroundImage: `url(${backBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: '50px',
                            bottom: '260px',
                            fontSize: '25px',
                            color: idConfig.back.dates.issueDate.color || '#111111',
                        }}
                    >
                        <div className="underline font-bold">{issueDate}</div>
                        <div style={{ fontWeight: '700' }}>Issue Date</div>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            right: '50px',
                            bottom: '260px',
                            fontSize: '25px',
                            color: idConfig.back.dates.expiredDate.color || '#111111',
                            textAlign: 'right',
                        }}
                    >
                        <div className="underline font-bold">{expiryDate}</div>
                        <div style={{ fontWeight: '700' }}>Expiry Date</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
