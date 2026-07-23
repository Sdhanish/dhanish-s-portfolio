import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth, ALLOWED_ADMIN_EMAIL } from '../../contexts/AuthContext';
import { ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const { currentUser, isAdmin, loginWithGoogle, authError, clearAuthError } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  if (currentUser && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    clearAuthError();
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-[#BDF869] selection:text-neutral-950 font-sans relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6C8E12]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#BDF869]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="p-6 md:p-8 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
        <a
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider text-neutral-400 hover:text-[#BDF869] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </a>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#BDF869]" />
          <span>Admin Portal</span>
        </div>
      </header>

      {/* Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl shadow-black/80 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-[#6C8E12]/20 border border-[#6C8E12]/30 text-[#BDF869] mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-white">
              Portfolio Admin Portal
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in with Google to access your Content Management System
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400 text-xs leading-relaxed animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-2 w-full">
                <span className="font-semibold block text-red-300">Access Denied</span>
                <div>{authError}</div>
                {authError.includes('Unauthorized Domain') && (
                  <div className="mt-2 pt-2 border-t border-red-500/20 text-[11px] text-neutral-300 space-y-1">
                    <p className="font-semibold text-[#BDF869]">How to fix in Firebase Console:</p>
                    <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                      <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline text-white">Firebase Console</a></li>
                      <li>Select project <code className="bg-neutral-800 px-1 py-0.5 rounded text-white font-mono">dhanish-s-portfolio</code></li>
                      <li>Go to <b>Authentication</b> &rarr; <b>Settings</b> &rarr; <b>Authorized domains</b></li>
                      <li>Click <b>Add domain</b> and paste:</li>
                    </ol>
                    <div className="flex items-center justify-between bg-black/50 p-2 rounded border border-neutral-700 font-mono text-xs text-[#BDF869] mt-1 select-all">
                      <span>{window.location.hostname}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Google Login Action Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-4 rounded-xl bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-100 transition-all shadow-lg hover:shadow-white/10 flex items-center justify-center space-x-3 disabled:opacity-50 cursor-pointer"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-neutral-900" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoggingIn ? 'Authenticating...' : 'Sign in with Google'}</span>
          </button>

          {/* Authorization Notice */}
          <div className="pt-2 text-center border-t border-neutral-800">
            <p className="text-[11px] font-mono text-neutral-500">
              Authorized Account: <span className="text-[#BDF869] font-bold">{ALLOWED_ADMIN_EMAIL}</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-neutral-600 font-mono relative z-10">
        &copy; {new Date().getFullYear()} Dhanish S. Portfolio Admin System
      </footer>
    </div>
  );
}
