import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
              <div className="max-w-4xl mx-auto text-center">
                {/* Logo Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl shadow-primary-500/30 mb-6">
                  <span className="text-4xl font-bold text-white">S</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent mb-4">
                  Sheltra
                </h1>
                <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-3">
                  Beyond Shelter
                </p>
                <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                  Mapping Skills to Sustainable Livelihoods
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                  <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Skills Verification
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Job Matching
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <svg className="w-4 h-4 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Career Support
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Get Started
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <a
                    href="#learn-more"
                    className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold py-3.5 px-8 rounded-xl border-2 border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Learn More
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                    <div className="text-3xl font-bold text-primary-600 mb-1">1K+</div>
                    <div className="text-sm text-gray-600">Refugees Helped</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                    <div className="text-3xl font-bold text-success-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Jobs Matched</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                    <div className="text-3xl font-bold text-warning-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">Partner Orgs</div>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
              <div className="text-center max-w-md">
                {/* 404 Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-xl mb-6">
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
