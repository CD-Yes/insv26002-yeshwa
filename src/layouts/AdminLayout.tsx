import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useAuth } from '@/app/providers/AuthProvider';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { LoadingState } from '@/components/common/LoadingState';
import { useEnquiries } from '@/hooks/useEnquiries';

/** Lets any admin page (via AdminTopbar) open the mobile sidebar drawer. */
interface AdminShell {
  openSidebar: () => void;
}
const AdminShellContext = createContext<AdminShell>({ openSidebar: () => {} });
// eslint-disable-next-line react-refresh/only-export-components
export const useAdminShell = () => useContext(AdminShellContext);

/**
 * Admin shell with auth guard + responsive sidebar.
 *  - Desktop (≥900px): fixed 264px sidebar, content offset by its width.
 *  - Mobile (<900px): sidebar becomes an off-canvas drawer with overlay; content
 *    is full width and a hamburger in AdminTopbar opens it.
 * Admin routes are NEVER gated by the public `pages` control.
 */
export function AdminLayout() {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const { newCount } = useEnquiries();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Escape closes the drawer; lock body scroll while it's open.
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  if (loading) {
    return <LoadingState minHeight="100vh" label="Checking access…" />;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <AdminShellContext.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
      <div style={{ fontFamily: FONTS.sans, background: COLORS.creamAdmin, color: COLORS.ink, minHeight: '100vh' }}>
        <AdminSidebar newEnquiries={newCount} mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile overlay */}
        <div
          className={`y-admin-overlay ${sidebarOpen ? 'is-open' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />

        <div className="y-admin-main">
          <Outlet />
        </div>

        <style>{`
          .y-admin-main { padding-left: 264px; min-width: 0; }
          .y-admin-overlay { display: none; }
          @media (max-width: 900px) {
            .y-admin-main { padding-left: 0; }
            .y-admin-sidebar {
              transform: translateX(-100%);
              transition: transform .25s ease;
              box-shadow: 24px 0 60px -30px rgba(0,0,0,0.5);
            }
            .y-admin-sidebar.is-open { transform: translateX(0); }
            .y-admin-overlay {
              display: block;
              position: fixed;
              inset: 0;
              background: rgba(22,36,43,0.45);
              z-index: 45;
              opacity: 0;
              pointer-events: none;
              transition: opacity .25s ease;
            }
            .y-admin-overlay.is-open { opacity: 1; pointer-events: auto; }
          }
          @media (prefers-reduced-motion: reduce) {
            .y-admin-sidebar, .y-admin-overlay { transition: none; }
          }
        `}</style>
      </div>
    </AdminShellContext.Provider>
  );
}
