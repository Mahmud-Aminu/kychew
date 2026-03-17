import { useState } from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import type { ProfileData } from '@/types/models';
import { useAuth } from '@/hooks/useAuth';

const DUMMY_PROFILE: ProfileData = {
    fullName: 'Aisha Bello',
    email: 'aisha.bello@email.com',
    phone: '+234 801 234 5678',
    state: 'Katsina',
    lga: 'Katsina',
    role: 'Community Health Worker',
    verified: false,
    avatarUrl: '',
    bio: 'Dedicated community health worker with 3+ years of experience in maternal and child health programs across Katsina State.',
    experiences: [],
    cvFileName: null,
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData>(DUMMY_PROFILE);
    const [editOpen, setEditOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<ProfileData>(DUMMY_PROFILE);
    const [verificationOpen, setVerificationOpen] = useState(false);
    const [verificationStep, setVerificationStep] = useState(1);
    const [verificationData, setVerificationData] = useState({
        emailOtp: '',
        idFile: null as string | null,
    });
    const {userProfile} = useAuth()
  
    const handleEditOpen = () => {
        setEditFormData(profile);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleEditChange = (field: keyof ProfileData, value: string) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditSave = () => {
        setProfile(editFormData);
        setEditOpen(false);
    };

    const handleVerificationOpen = () => {
        setVerificationStep(1);
        setVerificationData({ emailOtp: '', idFile: null });
        setVerificationOpen(true);
    };

    const handleVerificationClose = () => {
        setVerificationOpen(false);
    };

    const handleVerificationNext = () => {
        if (verificationStep < 3) {
            setVerificationStep(verificationStep + 1);
        }
    };

    const handleVerificationPrev = () => {
        if (verificationStep > 1) {
            setVerificationStep(verificationStep - 1);
        }
    };

    const handleVerificationComplete = () => {
        setProfile((prev) => ({ ...prev, verified: true }));
        setVerificationOpen(false);
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Profile header */}
            <Card>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-3xl font-bold text-white">
                        {userProfile?.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-surface-900">{userProfile?.fullName}</h1>
                        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <Badge variant="green">{userProfile?.userType}</Badge>
                             <Badge variant="green">{profile.verified ? 'Verified' : 'Not Verified'}</Badge>
                            <span className="text-sm text-surface-500">{userProfile?.lga} LGA, {profile.state} State</span>
                        </div>
                        <p className="mt-3 text-sm text-surface-600 leading-relaxed">{profile.bio}</p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0" onClick={handleEditOpen}>
                        Edit Profile
                    </Button>
                </div>
            </Card>

            {/* Verification Banner */}
            {!profile.verified && (
                <Card className="mt-6 border-l-4 border-l-amber-500 bg-amber-50">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="font-semibold text-surface-900">Account Verification Required</h3>
                            <p className="mt-1 text-sm text-surface-600">
                                Complete verification to get your ID card.
                            </p>
                        </div>
                        <Button onClick={handleVerificationOpen} className="shrink-0">
                            Get Verified
                        </Button>
                    </div>
                </Card>
            )}

            {/* Personal info */}
            <Card className="mt-6">
                <h2 className="text-lg font-semibold text-surface-900">Personal Information</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {[
                        { label: 'Full Name', value: userProfile?.fullName },
                        { label: 'Email', value: userProfile?.email },
                        { label: 'Phone', value: userProfile?.phone },
                        { label: 'State', value: profile.state },
                        { label: 'LGA', value: userProfile?.lga },
                        { label: 'Role', value: userProfile?.userType },
                    ].map((item) => (
                        <div key={item.label}>
                            <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                                {item.label}
                            </p>
                            <p className="mt-1 text-sm text-surface-800">{item.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Edit Profile Modal */}
            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-surface-900">Edit Profile</h2>
                            <button
                                onClick={handleEditClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 hover:bg-surface-100"
                                aria-label="Close"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                value={editFormData.fullName}
                                onChange={(e) => handleEditChange('fullName', e.target.value)}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => handleEditChange('email', e.target.value)}
                                required
                            />
                            <Input
                                label="Phone"
                                value={editFormData.phone}
                                onChange={(e) => handleEditChange('phone', e.target.value)}
                                required
                            />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    label="State"
                                    value={editFormData.state}
                                    onChange={(e) => handleEditChange('state', e.target.value)}
                                    required
                                />
                                <Input
                                    label="LGA"
                                    value={editFormData.lga}
                                    onChange={(e) => handleEditChange('lga', e.target.value)}
                                    required
                                />
                            </div>
                            <Input
                                label="Role"
                                value={editFormData.role}
                                onChange={(e) => handleEditChange('role', e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">Bio</label>
                                <textarea
                                    value={editFormData.bio}
                                    onChange={(e) => handleEditChange('bio', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <Button variant="outline" onClick={handleEditClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditSave}>
                                Save Changes
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Verification Modal */}
            {verificationOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl">
                        {/* Stepper */}
                        <div className="mb-8 flex items-center justify-between">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex flex-1 items-center">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                                            step <= verificationStep
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-surface-200 text-surface-600'
                                        }`}
                                    >
                                        {step < verificationStep ? '✓' : step}
                                    </div>
                                    {step < 3 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 ${
                                                step < verificationStep ? 'bg-primary-600' : 'bg-surface-200'
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-bold text-surface-900">
                            {verificationStep === 1 && 'Email Verification'}
                            {verificationStep === 2 && 'ID Verification'}
                            {verificationStep === 3 && 'Review & Confirm'}
                        </h2>
                        <p className="mt-2 text-sm text-surface-600">
                            {verificationStep === 1 && 'Verify your email address to continue'}
                            {verificationStep === 2 && 'Upload a valid government-issued ID'}
                            {verificationStep === 3 && 'Review your information and complete verification'}
                        </p>

                        <div className="mt-6">
                            {/* Step 1: Email Verification */}
                            {verificationStep === 1 && (
                                <div className="space-y-4">
                                    <p className="text-sm text-surface-600">
                                        We've sent a verification code to <strong>{profile.email}</strong>
                                    </p>
                                    <Input
                                        label="Verification Code"
                                        placeholder="Enter 6-digit code"
                                        value={verificationData.emailOtp}
                                        onChange={(e) =>
                                            setVerificationData((prev) => ({
                                                ...prev,
                                                emailOtp: e.target.value,
                                            }))
                                        }
                                        maxLength={6}
                                    />
                                    <Button variant="ghost" size="sm" className="mt-2">
                                        Didn't receive code? Resend
                                    </Button>
                                </div>
                            )}

                            {/* Step 2: ID Verification */}
                            {verificationStep === 2 && (
                                <div className="space-y-4">
                                    <p className="text-sm text-surface-600">
                                        Upload a clear photo of your government-issued ID (National ID, Driver's License, or Passport)
                                    </p>
                                    <div
                                        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                                            dragActive
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-surface-300 bg-surface-50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragOver={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDrop={(e) => {
                                            handleDrag(e);
                                            const files = e.dataTransfer.files;
                                            if (files.length > 0) {
                                                setVerificationData((prev) => ({
                                                    ...prev,
                                                    idFile: files[0].name,
                                                }));
                                            }
                                        }}
                                    >
                                        {verificationData.idFile ? (
                                            <>
                                                <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="mt-2 font-medium text-surface-900">{verificationData.idFile}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() =>
                                                        setVerificationData((prev) => ({
                                                            ...prev,
                                                            idFile: null,
                                                        }))
                                                    }
                                                >
                                                    Change
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-10 w-10 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="mt-2 text-sm font-medium text-surface-700">
                                                    Drag & drop your ID here
                                                </p>
                                                <p className="text-xs text-surface-500">or click to browse</p>
                                                <label className="mt-3 cursor-pointer">
                                                    <Button variant="outline" size="sm" type="button">
                                                        Browse Files
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) {
                                                                setVerificationData((prev) => ({
                                                                    ...prev,
                                                                    idFile: e.target.files![0].name,
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review & Confirm */}
                            {verificationStep === 3 && (
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-primary-50 p-4">
                                        <h3 className="font-semibold text-primary-900">Verification Summary</h3>
                                        <div className="mt-3 space-y-2 text-sm text-primary-800">
                                            <p>✓ Email verified: {profile.email}</p>
                                            <p>✓ ID submitted: {verificationData.idFile}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-surface-600">
                                        Your account is almost verified! We'll review your information and send you a confirmation email within 24 hours.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-3 justify-between">
                            <Button
                                variant="outline"
                                onClick={verificationStep === 1 ? handleVerificationClose : handleVerificationPrev}
                            >
                                {verificationStep === 1 ? 'Cancel' : 'Back'}
                            </Button>
                            <Button
                                onClick={verificationStep === 3 ? handleVerificationComplete : handleVerificationNext}
                                disabled={
                                    (verificationStep === 1 && verificationData.emailOtp.length < 6) ||
                                    (verificationStep === 2 && !verificationData.idFile)
                                }
                            >
                                {verificationStep === 3 ? 'Complete Verification' : 'Next'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
