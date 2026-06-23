import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useAuth } from '@/app/providers/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LoadingState } from '@/components/common/LoadingState';
import { useEnquiries } from '@/hooks/useEnquiries';

/**
 * Admin shell with auth guard. Admin routes are NEVER gated by the public
 * `pages` control — a valid admin always has access. Unauthenticated users are
 * redirected to the login page.
 */
export function AdminLayout() {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const { newCount } = useEnquiries();

  if (loading) {
    return <LoadingState minHeight="100vh" label="Checking access…" />;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <div style={{ fontFamily: FONTS.sans, background: COLORS.creamAdmin, color: COLORS.ink, minHeight: '100vh' }}>
      <AdminSidebar newEnquiries={newCount} />
      <div className="y-admin-main" style={{ paddingLeft: 264 }}>
        <Outlet />
      </div>
      <style>{`
        @media (max-width: 720px) {
          .y-admin-sidebar { transform: translateX(-100%); transition: transform .2s; }
          .y-admin-main { padding-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
