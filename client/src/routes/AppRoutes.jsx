import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PublicLayout, RefugeeLayout, NGOLayout, EmployerLayout, AdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { PageLoader } from '@/components/ui/Loader';

// Public pages
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Contact from '@/pages/public/Contact';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import Unauthorized from '@/pages/public/Unauthorized';

// Shared
import Settings from '@/pages/shared/Settings';

// Refugee pages
import RefugeeDashboard from '@/pages/refugee/Dashboard';
import RefugeeProfile from '@/pages/refugee/ProfileForm';
import Opportunities from '@/pages/refugee/Opportunities';

// NGO pages
import NGODashboard from '@/pages/ngo/Dashboard';
import Cases from '@/pages/ngo/Cases';
import CaseDetail from '@/pages/ngo/CaseDetail';

// Employer pages
import EmployerDashboard from '@/pages/employer/Dashboard';
import EmployerProfile from '@/pages/employer/Profile';
import Jobs from '@/pages/employer/Jobs';
import Talent from '@/pages/employer/Talent';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import Users from '@/pages/admin/Users';
import NGOs from '@/pages/admin/NGOs';
import AuditLogs from '@/pages/admin/AuditLogs';

function NavigationSpinner() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return visible ? <PageLoader /> : null;
}

export default function AppRoutes() {
  return (
    <>
      <NavigationSpinner />
      <Routes>
      {/* ── Public routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ── Refugee routes ── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['refugee']}>
            <RefugeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/refugee/dashboard" element={<RefugeeDashboard />} />
        <Route path="/refugee/profile" element={<RefugeeProfile />} />
        <Route path="/refugee/opportunities" element={<Opportunities />} />
      </Route>

      {/* ── NGO routes ── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <NGOLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/ngo/dashboard" element={<NGODashboard />} />
        <Route path="/ngo/cases" element={<Cases />} />
        <Route path="/ngo/cases/:id" element={<CaseDetail />} />
      </Route>

      {/* ── Employer routes ── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['employer']}>
            <EmployerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/profile" element={<EmployerProfile />} />
        <Route path="/employer/jobs" element={<Jobs />} />
        <Route path="/employer/talent" element={<Talent />} />
      </Route>

      {/* ── Admin routes ── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/ngos" element={<NGOs />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={
        <PublicLayout />
      }>
        <Route path="*" element={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-text-primary dark:text-text-darkPrimary mb-2">404</h1>
              <p className="text-text-secondary dark:text-text-darkSecondary">Page not found</p>
            </div>
          </div>
        } />
      </Route>
    </Routes>
    </>
  );
}
