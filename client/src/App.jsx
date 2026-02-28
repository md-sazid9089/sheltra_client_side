import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RefugeeDashboard from './pages/RefugeeDashboard';
import RefugeeProfile from './pages/RefugeeProfile';
import Opportunities from './pages/Opportunities';
import Placements from './pages/Placements';
import AdminPanel from './pages/AdminPanel';
import TalentPool from './pages/TalentPool';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import AppShell from './components/AppShell';

function App() {
  return (
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

        {/* Home Route */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Sheltra</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Beyond Shelter: Mapping Skills to Sustainable Livelihoods
                </p>
                <a
                  href="/login"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Go to Login
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
