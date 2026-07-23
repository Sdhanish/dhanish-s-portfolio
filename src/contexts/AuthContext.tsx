import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        setCurrentUser(user);
        setIsAdmin(true);
        setAuthError(null);
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError(`Unauthorized Domain: The domain "${window.location.hostname}" is not authorized in your Firebase Console. Please add it under Authentication -> Settings -> Authorized Domains.`);
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Failed to sign in with Google');
      }
    } finally {
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
