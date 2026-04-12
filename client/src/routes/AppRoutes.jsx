import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { PublicLayout, RefugeeLayout, NGOLayout, EmployerLayout, AdminLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { PageLoader } from '@/components/ui/Loader';

// Public pages (eagerly loaded - essential for app startup)
import Home from '@/pages/public/Home';
import About from '@/pages/public/About';
import Contact from '@/pages/public/Contact';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import Unauthorized from '@/pages/public/Unauthorized';
import Settings from '@/pages/shared/Settings';

// Refugee pages (lazy loaded)
const RefugeeDashboard = lazy(() => import('@/pages/refugee/Dashboard'));
const RefugeeProfile = lazy(() => import('@/pages/refugee/ProfileForm'));
const Opportunities = lazy(() => import('@/pages/refugee/Opportunities'));
const Blogs = lazy(() => import('@/pages/refugee/Blogs'));
const CVRating = lazy(() => import('@/pages/refugee/CVRating'));
const VirtualNIDCheck = lazy(() => import('@/pages/refugee/VirtualNIDCheck'));

// NGO pages (lazy loaded)
const NGODashboard = lazy(() => import('@/pages/ngo/Dashboard'));
const Cases = lazy(() => import('@/pages/ngo/Cases'));
const CaseDetail = lazy(() => import('@/pages/ngo/CaseDetail'));
const NGOUpgrade = lazy(() => import('@/pages/ngo/Upgrade'));

// Employer pages (lazy loaded)
const EmployerDashboard = lazy(() => import('@/pages/employer/Dashboard'));
const EmployerProfile = lazy(() => import('@/pages/employer/Profile'));
const Jobs = lazy(() => import('@/pages/employer/Jobs'));
const Talent = lazy(() => import('@/pages/employer/Talent'));

// Admin pages (lazy loaded)
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Users = lazy(() => import('@/pages/admin/Users'));
const NGOs = lazy(() => import('@/pages/admin/NGOs'));
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs'));

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
      <Suspense fallback={<PageLoader />}>
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

          {/* ── Refugee routes (lazy-loaded) ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['refugee']}>
                <RefugeeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/refugee/dashboard" element={<Suspense fallback={<PageLoader />}><RefugeeDashboard /></Suspense>} />
            <Route path="/refugee/profile" element={<Suspense fallback={<PageLoader />}><RefugeeProfile /></Suspense>} />
            <Route path="/refugee/opportunities" element={<Suspense fallback={<PageLoader />}><Opportunities /></Suspense>} />
            <Route path="/refugee/blogs" element={<Suspense fallback={<PageLoader />}><Blogs /></Suspense>} />
            <Route path="/refugee/cv-rating" element={<Suspense fallback={<PageLoader />}><CVRating /></Suspense>} />
            <Route path="/refugee/nid-check" element={<Suspense fallback={<PageLoader />}><VirtualNIDCheck /></Suspense>} />
          </Route>

          {/* ── NGO routes (lazy-loaded) ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NGOLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/ngo/dashboard" element={<Suspense fallback={<PageLoader />}><NGODashboard /></Suspense>} />
            <Route path="/ngo/upgrade" element={<Suspense fallback={<PageLoader />}><NGOUpgrade /></Suspense>} />
            <Route path="/ngo/cases" element={<Suspense fallback={<PageLoader />}><Cases /></Suspense>} />
            <Route path="/ngo/cases/:id" element={<Suspense fallback={<PageLoader />}><CaseDetail /></Suspense>} />
          </Route>

          {/* ── Employer routes (lazy-loaded) ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/employer/dashboard" element={<Suspense fallback={<PageLoader />}><EmployerDashboard /></Suspense>} />
            <Route path="/employer/profile" element={<Suspense fallback={<PageLoader />}><EmployerProfile /></Suspense>} />
            <Route path="/employer/jobs" element={<Suspense fallback={<PageLoader />}><Jobs /></Suspense>} />
            <Route path="/employer/talent" element={<Suspense fallback={<PageLoader />}><Talent /></Suspense>} />
          </Route>

          {/* ── Admin routes (lazy-loaded) ── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="/admin/users" element={<Suspense fallback={<PageLoader />}><Users /></Suspense>} />
            <Route path="/admin/ngos" element={<Suspense fallback={<PageLoader />}><NGOs /></Suspense>} />
            <Route path="/admin/audit-logs" element={<Suspense fallback={<PageLoader />}><AuditLogs /></Suspense>} />
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
      </Suspense>
    </>
  );
}
