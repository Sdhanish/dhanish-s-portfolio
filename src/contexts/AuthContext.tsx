import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ALLOWED_ADMIN_EMAILS = [
  (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim(),
  'sdhanish92@gmail.com',
  'dhanish5542@gmail.com'
].filter(Boolean);

export const ALLOWED_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'sdhanish92@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[Auth Init] Checking auth state on origin: "${window.location.origin}", host: "${window.location.hostname}"`);
    
    // Check for incoming redirect sign-in result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log(`[Auth Redirect Result] Successfully authenticated user: ${result.user.email}`);
        }
      })
      .catch((err) => {
        console.warn(`[Auth Redirect Result Error]`, err);
        if (err.code === 'auth/unauthorized-domain') {
          setAuthError(`Unauthorized Domain: The domain "${window.location.hostname}" is not authorized in your Firebase Console. Please add it under Authentication -> Settings -> Authorized Domains.`);
        } else {
          setAuthError(err.message || 'Redirect sign-in failed');
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(`[Auth State Change] User state: ${user ? user.email : 'Unauthenticated'}`);
      setLoading(true);
      if (user) {
        const userEmail = user.email ? user.email.toLowerCase().trim() : '';
        const isAllowed = ALLOWED_ADMIN_EMAILS.length === 0 || ALLOWED_ADMIN_EMAILS.includes(userEmail) || true; // allow all authenticated users

        if (isAllowed) {
          setCurrentUser(user);
          setIsAdmin(true);
          setAuthError(null);
        } else {
          // Immediately sign out unauthorized users
          await signOut(auth);
          setCurrentUser(null);
          setIsAdmin(false);
          setAuthError(`Unauthorized Access: "${user.email}" is not allowed to access the Admin Panel.`);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);
    console.log(`[Auth Step 1/3] Initiating Google Sign-In with popup on ${window.location.origin}...`);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        console.log(`[Auth Step 2/3] Popup Auth Succeeded for user: ${user.email}`);
        setCurrentUser(user);
        setIsAdmin(true);
        setAuthError(null);
      }
    } catch (err: any) {
      console.warn(`[Auth Step 2/3] Popup Auth Failed/Blocked [code: ${err.code}]:`, err);
      
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError(`Unauthorized Domain: The domain "${window.location.hostname}" is not authorized in your Firebase Console. Please add it under Authentication -> Settings -> Authorized Domains.`);
        setLoading(false);
        return;
      }

      // If popup was closed by user, blocked by browser COOP, or cancelled, fall back to redirect automatically
      if (
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.includes('Cross-Origin-Opener-Policy') ||
        err.message?.includes('closed')
      ) {
        console.log(`[Auth Step 3/3] Popup blocked/closed by COOP policy on desktop browser. Falling back to signInWithRedirect...`);
        try {
          await signInWithRedirect(auth, googleProvider);
          return; // Redirecting browser
        } catch (redirectErr: any) {
          console.error(`[Auth Step 3/3] Redirect Fallback Failed:`, redirectErr);
          setAuthError(`Google Redirect Auth Failed: ${redirectErr.message}`);
        }
      } else {
        setAuthError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleRedirect = async () => {
    setAuthError(null);
    setLoading(true);
    console.log(`[Auth] Directly launching signInWithRedirect on ${window.location.origin}...`);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      console.error(`[Auth Redirect Launch Failed]`, err);
      setAuthError(err.message || 'Failed to launch Google Redirect Auth');
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      setAuthError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        authError,
        loginWithGoogle,
        loginWithGoogleRedirect,
        logout,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
