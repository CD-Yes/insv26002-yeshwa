import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminPagesPage } from '@/pages/admin/AdminPagesPage';
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage';
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage';
import { AdminBlogsPage } from '@/pages/admin/AdminBlogsPage';
import { AdminBlogEditorPage } from '@/pages/admin/AdminBlogEditorPage';
import { AdminEnquiriesPage } from '@/pages/admin/AdminEnquiriesPage';
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminSystemHealthPage } from '@/pages/admin/AdminSystemHealthPage';

/**
 * Admin router (lazy-loaded chunk). Mounted at /admin/*.
 * Login is public; everything else sits behind AdminLayout's auth guard.
 * These routes are NEVER affected by the public `pages` live/off control.
 */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="pages" element={<AdminPagesPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="blogs" element={<AdminBlogsPage />} />
        <Route path="blogs/new" element={<AdminBlogEditorPage />} />
        <Route path="blogs/:id" element={<AdminBlogEditorPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="system-health" element={<AdminSystemHealthPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
