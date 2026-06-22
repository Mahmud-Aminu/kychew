import Button from '@/components/common/Button';

interface RegenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function RegenerateModal({ isOpen, onClose, onConfirm }: RegenerateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="idcard-modal-backdrop">
            <style>{`
                .idcard-modal-backdrop {
                    position: fixed; inset: 0; z-index: 50;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.45);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    animation: regen-fade-in 0.25s ease-out;
                }
                .regen-modal-card {
                    background: white;
                    border-radius: 1.25rem;
                    padding: 2.5rem 2rem;
                    width: 92%; max-width: 420px;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.18);
                    text-align: center;
                    animation: regen-fade-in 0.35s ease-out;
                }
                @keyframes regen-fade-in {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes regen-pulse {
                    0%, 100% { transform: scale(1); }
                    50%      { transform: scale(1.06); }
                }
            `}</style>
            <div className="regen-modal-card">
                {/* Warning icon */}
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        animation: 'regen-pulse 0.6s ease-in-out',
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h3 style={{ marginTop: 20, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                    ID Card Already Exists
                </h3>
                <p style={{ marginTop: 8, fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                    An ID card has already been generated for your account. Do you want to regenerate it? This will replace the existing card.
                </p>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                    <Button variant="outline" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="md" onClick={onConfirm}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Regenerate
                    </Button>
                </div>
            </div>
        </div>
    );
}
