import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RefugeeDashboard from './pages/RefugeeDashboard';
import RefugeeProfile from './pages/RefugeeProfile';
import Opportunities from './pages/Opportunities';
import Placements from './pages/Placements';
import AdminPanel from './pages/AdminPanel';
import AdminUsers from './pages/AdminUsers';
import AdminAuditLogs from './pages/AdminAuditLogs';
import SDGImpactDashboard from './pages/SDGImpactDashboard';
import TalentPool from './pages/TalentPool';
import EmployerFeedback from './pages/EmployerFeedback';
import EmployerOnboarding from './pages/EmployerOnboarding';
import EmployerJobPosting from './pages/EmployerJobPosting';
import EmployerJobsList from './pages/EmployerJobsList';
import NGOVerificationQueue from './pages/NGOVerificationQueue';
import ConsentManagement from './pages/ConsentManagement';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import AppShell from './components/AppShell';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
    <ToastProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['refugee']}>
                <AppShell>
                  <RefugeeDashboard />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['refugee']}>
                <AppShell>
                  <RefugeeProfile />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Opportunities Route - Refugee */}
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['refugee']}>
                <AppShell>
                  <Opportunities />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Placements Route - Refugee */}
        <Route
          path="/placements"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['refugee']}>
                <AppShell>
                  <Placements />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Consent Management Route - Refugee */}
        <Route
          path="/consent"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['refugee']}>
                <AppShell>
                  <ConsentManagement />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Talent Pool Route - Employer */}
        <Route
          path="/talent-pool"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['employer']}>
                <AppShell>
                  <TalentPool />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Employer Feedback Route */}
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['employer']}>
                <AppShell>
                  <EmployerFeedback />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Employer Onboarding Route */}
        <Route
          path="/employer/onboarding"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['employer']}>
                <EmployerOnboarding />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Employer Job Posting Route */}
        <Route
          path="/jobs/new"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['employer']}>
                <AppShell>
                  <EmployerJobPosting />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Employer Jobs List Route */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['employer']}>
                <AppShell>
                  <EmployerJobsList />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* NGO Verification Queue Route */}
        <Route
          path="/ngo/verifications"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['ngo']}>
                <AppShell>
                  <NGOVerificationQueue />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Admin-Only Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin', 'Administrator']}>
                <AppShell>
                  <AdminPanel />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Admin Users Management Route */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin', 'Administrator']}>
                <AppShell>
                  <AdminUsers />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Admin Audit Logs Route */}
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin', 'Administrator']}>
                <AppShell>
                  <AdminAuditLogs />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* SDG Impact Dashboard Route */}
        <Route
          path="/admin/impact"
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin', 'Administrator']}>
                <AppShell>
                  <SDGImpactDashboard />
                </AppShell>
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
              <div className="text-center max-w-md">
                {/* 404 Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-gray-400 to-gray-500 rounded-2xl shadow-xl mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* 404 Text */}
                <p className="text-7xl font-bold text-gray-300 mb-4">404</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-8">
                  The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
    </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
