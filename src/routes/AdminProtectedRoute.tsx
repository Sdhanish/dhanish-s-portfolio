import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminProtectedRoute({ children }: { children?: ReactNode }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#BDF869] animate-spin mb-4" />
        <p className="text-neutral-400 font-mono text-sm tracking-wider">Verifying Admin Permissions...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
