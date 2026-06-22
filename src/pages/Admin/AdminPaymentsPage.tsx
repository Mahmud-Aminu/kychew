import { useState, useEffect, useCallback } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import {
  getPaymentsByStatus,
  confirmPayment,
  rejectPayment,
} from "@/services/paymentService";
import type { PaymentRecord } from "@/types/models";

type TabKey = "pending" | "completed" | "rejected";

export default function AdminPaymentsPage() {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ paymentId: string; userId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [receiptModal, setReceiptModal] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPaymentsByStatus(activeTab);
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (active) {
        fetchPayments();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchPayments]);

  const handleConfirm = async (payment: PaymentRecord) => {
    if (!payment.id || !currentUser?.uid) return;
    setActionLoading(payment.id);
    try {
      await confirmPayment(payment.id, payment.userId, currentUser.uid);
      await fetchPayments();
    } catch (err) {
      console.error("Failed to confirm:", err);
      alert("Failed to confirm payment. Please try again.");
    }
    setActionLoading(null);
  };

  const handleReject = async () => {
    if (!rejectModal || !currentUser?.uid || !rejectReason.trim()) return;
    setActionLoading(rejectModal.paymentId);
    try {
      await rejectPayment(rejectModal.paymentId, rejectModal.userId, currentUser.uid, rejectReason);
      setRejectModal(null);
      setRejectReason("");
      await fetchPayments();
    } catch (err) {
      console.error("Failed to reject:", err);
      alert("Failed to reject payment. Please try again.");
    }
    setActionLoading(null);
  };

  // Simple admin guard
  if (userProfile && userProfile.userType !== "Admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md text-center p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-surface-900">Access Denied</h2>
          <p className="mt-2 text-sm text-surface-500">You don't have permission to view this page.</p>
        </Card>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; color: string }[] = [
    { key: "pending", label: "Pending", color: "bg-amber-500" },
    { key: "completed", label: "Confirmed", color: "bg-accent-500" },
    { key: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary-50/60 via-surface-50 to-surface-50">
      <style>{`
        @keyframes admin-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-card-enter { animation: admin-fade-in 0.3s ease-out forwards; }
      `}</style>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 shadow-lg shadow-primary-500/20">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-surface-900">
            Payment Verification
          </h1>
          <p className="mt-2 text-surface-500">
            Review and verify member payment submissions.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex rounded-xl bg-surface-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-white text-surface-900 shadow-sm"
                  : "text-surface-500 hover:text-surface-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && payments.length > 0 && (
                <span className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${tab.color}`}>
                  {payments.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <Card className="rounded-2xl">
              <div className="flex flex-col items-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-200 border-t-primary-600" />
                <p className="mt-3 text-sm text-surface-500">Loading payments…</p>
              </div>
            </Card>
          ) : payments.length === 0 ? (
            <Card className="rounded-2xl">
              <div className="flex flex-col items-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-100">
                  <svg className="h-8 w-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-medium text-surface-600">No {activeTab} payments</p>
                <p className="text-xs text-surface-400">
                  {activeTab === "pending" ? "All caught up! No payments awaiting review." : `No ${activeTab} payments found.`}
                </p>
              </div>
            </Card>
          ) : (
            payments.map((payment, idx) => (
              <div
                key={payment.id}
                className="admin-card-enter"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <Card className="rounded-2xl">
                  <div className="space-y-4">
                    {/* User info row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                          {payment.fullName?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-surface-900">{payment.fullName}</p>
                          <p className="text-xs text-surface-400">{payment.membershipId}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        payment.payment_status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : payment.payment_status === "completed"
                            ? "bg-accent-100 text-accent-700"
                            : "bg-red-100 text-red-700"
                      }`}>
                        {payment.payment_status === "pending" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        {payment.payment_status === "completed" && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-surface-50 p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-surface-400">Transaction ID</p>
                        <p className="mt-0.5 font-mono text-xs font-bold text-primary-700">{payment.transactionId}</p>
                      </div>
                      <div className="rounded-lg bg-surface-50 p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-surface-400">Amount</p>
                        <p className="mt-0.5 text-xs font-bold text-surface-800">₦{payment.amount?.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-surface-50 p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-surface-400">Payment Date</p>
                        <p className="mt-0.5 text-xs font-semibold text-surface-700">{payment.paymentDate}</p>
                      </div>
                      <div className="rounded-lg bg-surface-50 p-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-surface-400">Submitted</p>
                        <p className="mt-0.5 text-xs font-semibold text-surface-700">
                          {payment.submittedAt ? new Date(payment.submittedAt).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Receipt + Actions */}
                    <div className="flex items-center justify-between border-t border-surface-100 pt-3">
                      <button
                        type="button"
                        onClick={() => setReceiptModal(payment.receiptUrl)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        View Receipt
                      </button>

                      {activeTab === "pending" && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionLoading === payment.id}
                            onClick={() => setRejectModal({ paymentId: payment.id!, userId: payment.userId })}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={actionLoading === payment.id}
                            loading={actionLoading === payment.id}
                            onClick={() => handleConfirm(payment)}
                          >
                            ✅ Confirm & Release ID
                          </Button>
                        </div>
                      )}

                      {payment.payment_status === "rejected" && payment.rejectionReason && (
                        <p className="text-xs text-red-600 italic max-w-[200px] truncate" title={payment.rejectionReason}>
                          Reason: {payment.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {receiptModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setReceiptModal(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-lg w-[92%] overflow-auto rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setReceiptModal(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-sm font-bold text-surface-800 mb-3">Payment Receipt</h3>
            <img src={receiptModal} alt="Payment receipt" className="w-full rounded-xl" />
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => { setRejectModal(null); setRejectReason(""); }}
        >
          <div
            className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-surface-900">Reject Payment</h3>
            <p className="mt-1 text-sm text-surface-500">Please provide a reason for rejection.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Payment not found on bank statement…"
              rows={3}
              className="mt-4 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setRejectModal(null); setRejectReason(""); }}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!rejectReason.trim() || actionLoading === rejectModal.paymentId}
                loading={actionLoading === rejectModal.paymentId}
                onClick={handleReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
