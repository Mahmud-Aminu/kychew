import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { loginWithEmail, logout as authLogout, registerWithEmail, getUserDocument } from '../services/authServices';
import type { UserProfile } from '../types/models';

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen for Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch user profile from Firestore
                try {
                    const profile = await getUserDocument(user.uid);
                    setUserProfile(profile);
                    console.log('Fetched user profile:', profile);
                } catch (err) {
                    console.error('Failed to fetch user profile:', err);
                    setUserProfile(null);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);

            await loginWithEmail(email, password);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to login';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);

            await registerWithEmail(email, password);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to register';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await authLogout();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to logout';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

    /**
     * Manually re-fetches the Firestore user document and updates userProfile.
     * Call this after writing a new profile (e.g. post-onboarding) because
     * onAuthStateChanged does NOT re-fire for the same authenticated user.
     */
    const refreshUserProfile = async () => {
        if (!auth.currentUser) return;
        try {
            const profile = await getUserDocument(auth.currentUser.uid);
            setUserProfile(profile);
        } catch (err) {
            console.error('Failed to refresh user profile:', err);
        }
    };

    const value: AuthContextType = {
        currentUser,
        userProfile,
        loading,
        login,
        register,
        logout,
        refreshUserProfile,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
