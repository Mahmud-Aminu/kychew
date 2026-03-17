/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "../../firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, runTransaction } from "firebase/firestore";
import type { UserProfile } from "../types/models";

/**
 * Friendly error messages for common Firebase auth errors
 */
function getErrorMessage(code: string): string {
    const errorMap: Record<string, string> = {
        "auth/user-not-found": "We couldn't find an account with that email. Please check and try again.",
        "auth/wrong-password": "The password you entered is incorrect. Please try again.",
        "auth/invalid-email": "That doesn't look like a valid email address. Please check and try again.",
        "auth/user-disabled": "This account has been suspended. Please contact support for help.",
        "auth/email-already-in-use": "An account with this email already exists. Try signing in instead.",
        "auth/weak-password": "Your password is too short. Please use at least 6 characters.",
        "auth/operation-not-allowed": "Registration is currently unavailable. Please try again later.",
        "auth/too-many-requests": "Too many attempts. For your security, please wait a few minutes before trying again.",
        "auth/invalid-credential": "The email or password you entered is incorrect. Please try again.",
        "auth/network-request-failed": "Unable to connect. Please check your internet connection and try again.",
        "auth/popup-closed-by-user": "The sign-in popup was closed before completing. Please try again.",
        "auth/account-exists-with-different-credential": "An account already exists with this email using a different sign-in method.",
        "auth/requires-recent-login": "For security reasons, please sign in again to continue.",
        "auth/internal-error": "Something went wrong on our end. Please try again in a moment.",
    };
    return errorMap[code] || "Something went wrong. Please try again.";
}

/**
 * create a new account and add a corresponding
 * `users/{uid}` document in Firestore.
 */
export async function registerWithEmail(
    email: string,
    password: string
): Promise<UserCredential> {
    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // write a minimal profile to Firestore – add whatever fields you need
        await setDoc(doc(db, "users", credential.user.uid), {
            uid: credential.user.uid,
            email: credential.user.email,
            createdAt: new Date(),
        });

        return credential;
    } catch (err: any) {
        throw new Error(getErrorMessage(err.code));
    }
}

/**
 * sign in an existing user with email/password
 */
export async function loginWithEmail(
    email: string,
    password: string
): Promise<UserCredential> {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        throw new Error(getErrorMessage(err.code));
    }
}

/**
 * sign out the current user
 */
export function logout(): Promise<void> {
    return auth.signOut();
}

/**
 * Create or update a document in the `users` collection
 * using the user's UID as the document ID.
 * Uses merge so existing fields are not overwritten.
 */
export async function setUserDocument(
    uid: string,
    data: Record<string, any>
): Promise<void> {
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
    } catch (err: any) {
        throw new Error(err.message || "Failed to save user data.");
    }
}

/**
 * Get a user document from the `users` collection
 * using the user's UID as the document ID.
 */
export async function getUserDocument(uid: string): Promise<UserProfile | null> {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data() as UserProfile;
            console.log('Retrieved user data:', userData);
            return userData;
        } else {
            console.log('No user data found for UID:', uid);
            return null;
        }
    } catch (err: any) {
        throw new Error(err.message || "Failed to get user data.");
    }
}



export async function generateMembershipId() {
  const counterRef = doc(db, "counters", "membership");

  const newNumber = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    if (!counterDoc.exists()) {
      throw new Error("Counter document does not exist");
    }

    const current = counterDoc.data().current || 0;
    const nextNumber = current + 1;

    transaction.update(counterRef, { current: nextNumber });

    return nextNumber;
  });

  // Format membership number (0001)
  const membershipNumber = String(newNumber).padStart(4, "0");

  // Get current year (26)
  const year = new Date().getFullYear().toString().slice(-2);

  return `KYCHEW-${year}-${membershipNumber}`;
}
