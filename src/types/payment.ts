// Manual Payment types
// PaymentRecord is defined in models.ts
// This file is kept for any future payment-specific type extensions

export type PaymentStatus = "none" | "pending" | "completed" | "rejected";

export interface PaymentSubmission {
  userId: string;
  membershipId: string;
  fullName: string;
  transactionId: string;
  paymentDate: string;
  receiptFile: File;
}
