import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@fontsource/great-vibes';
import '@fontsource/cormorant-garamond';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './contexts/AuthContext.tsx';
import { PortfolioProvider } from './contexts/PortfolioContext.tsx';

// Lazy-loaded Admin routes for code splitting
const AdminProtectedRoute = lazy(() => import('./admin/components/AdminProtectedRoute.tsx'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout.tsx'));
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin.tsx'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard.tsx'));
const AdminPersonalInfo = lazy(() => import('./admin/pages/AdminPersonalInfo.tsx'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects.tsx'));
const AdminSkills = lazy(() => import('./admin/pages/AdminSkills.tsx'));
const AdminServices = lazy(() => import('./admin/pages/AdminServices.tsx'));
const AdminTimeline = lazy(() => import('./admin/pages/AdminTimeline.tsx'));
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages.tsx'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings.tsx'));

const AdminLoading = () => (
  <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-[#BDF869] font-mono text-xs">
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 border-2 border-[#BDF869] border-t-transparent rounded-full animate-spin" />
      <span>Loading Admin Console...</span>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<App />} />

            {/* Admin Login Route */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminLoading />}>
                  <AdminLogin />
                </Suspense>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminLoading />}>
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                </Suspense>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="personal-info" element={<AdminPersonalInfo />} />
              <Route path="personal" element={<Navigate to="/admin/personal-info" replace />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="timeline" element={<AdminTimeline />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

