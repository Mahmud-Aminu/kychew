import { db, storage } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { PaymentRecord } from "../types/models";

// ─── Bank Details (update these with actual values) ───
export const BANK_DETAILS = {
  bankName: "Zenith Bank",
  accountNumber: "1234567890",
  accountName: "KYCHEW LTD",
} as const;

export const PAYMENT_AMOUNT = 1_000; // ₦1,000

// ─── Generate Unique Transaction ID ───
export function generateTransactionId(membershipId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  const prefix = membershipId
    ? membershipId.split("-").pop()?.slice(-4) || "0000"
    : "0000";
  return `KYC-${prefix}-${timestamp}${random}`.slice(0, 16);
}

// ─── Upload Receipt to Firebase Storage ───
async function uploadReceipt(file: File, userId: string): Promise<string> {
  const fileName = `receipts/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Submit Payment Proof ───
export async function submitPaymentProof(data: {
  userId: string;
  membershipId: string;
  fullName: string;
  transactionId: string;
  paymentDate: string;
  receiptFile: File;
}): Promise<string> {
  // Upload the receipt image
  const receiptUrl = await uploadReceipt(data.receiptFile, data.userId);

  // Create the payment record
  const paymentData: Omit<PaymentRecord, "id"> = {
    userId: data.userId,
    membershipId: data.membershipId,
    fullName: data.fullName,
    transactionId: data.transactionId,
    amount: PAYMENT_AMOUNT,
    paymentDate: data.paymentDate,
    receiptUrl,
    payment_status: "pending",
    submittedAt: new Date().toISOString(),
    verifiedAt: null,
    verifiedBy: null,
    rejectionReason: null,
  };

  const docRef = await addDoc(collection(db, "payments"), paymentData);

  // Update user's payment_status to "pending"
  await updateDoc(doc(db, "users", data.userId), {
    payment_status: "pending",
  });

  return docRef.id;
}

// ─── Get Payment Status for a User ───
export async function getPaymentStatus(
  userId: string,
): Promise<"none" | "pending" | "completed"> {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return "none";
  return userDoc.data()?.payment_status || "none";
}

// ─── Get User's Payment Record ───
export async function getUserPayment(
  userId: string,
): Promise<PaymentRecord | null> {
  const q = query(
    collection(db, "payments"),
    where("userId", "==", userId),
    orderBy("submittedAt", "desc"),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as PaymentRecord;
}

// ─── Admin: Get All Payments by Status ───
export async function getPaymentsByStatus(
  status: "pending" | "completed" | "rejected",
): Promise<PaymentRecord[]> {
  const q = query(
    collection(db, "payments"),
    where("payment_status", "==", status),
    orderBy("submittedAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as PaymentRecord);
}

// ─── Admin: Confirm Payment & Release ID ───
export async function confirmPayment(
  paymentId: string,
  userId: string,
  adminUid: string,
): Promise<void> {
  // Update payment record
  await updateDoc(doc(db, "payments", paymentId), {
    payment_status: "completed",
    verifiedAt: Timestamp.now(),
    verifiedBy: adminUid,
  });

  // Update user's payment_status
  await updateDoc(doc(db, "users", userId), {
    payment_status: "completed",
  });
}

// ─── Admin: Reject Payment ───
export async function rejectPayment(
  paymentId: string,
  userId: string,
  adminUid: string,
  reason: string,
): Promise<void> {
  await updateDoc(doc(db, "payments", paymentId), {
    payment_status: "rejected",
    verifiedAt: Timestamp.now(),
    verifiedBy: adminUid,
    rejectionReason: reason,
  });

  // Reset user's payment_status so they can resubmit
  await updateDoc(doc(db, "users", userId), {
    payment_status: "none",
  });
}

// ─── Upload Passport and Signature Assets ───
export async function uploadIDCardAssets(
  userId: string,
  passportFile: File,
  signatureDataUrl: string,
  issueDate: string,
  expiryDate: string,
): Promise<{
  avatarUrl: string;
  signatureUrl: string;
  issueDate: string;
  expiryDate: string;
}> {
  // Upload passport
  const passportName = `passports/${userId}/${Date.now()}_passport.png`;
  const passportRef = ref(storage, passportName);

  await uploadBytes(passportRef, passportFile);
  const avatarUrl = await getDownloadURL(passportRef);

  // Upload signature
  const signatureBlob = await (await fetch(signatureDataUrl)).blob();
  const signatureName = `signatures/${userId}/${Date.now()}_signature.png`;
  const signatureRef = ref(storage, signatureName);

  await uploadBytes(signatureRef, signatureBlob);
  const signatureUrl = await getDownloadURL(signatureRef);

  // Update Firestore
  await updateDoc(doc(db, "users", userId), {
    avatarUrl,
    signatureUrl,
    issueDate,
    expiryDate,
    updatedAt: serverTimestamp(),
  });

  return {
    avatarUrl,
    signatureUrl,
    issueDate,
    expiryDate,
  };
}
