import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PageGate } from '@/components/public/PageGate';
import { LoadingState } from '@/components/common/LoadingState';

// Public pages — eager (small, critical path).
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ProductsPage } from '@/pages/public/ProductsPage';
import { GalleryPage } from '@/pages/public/GalleryPage';
import { BlogPage } from '@/pages/public/BlogPage';
import { BlogDetailPage } from '@/pages/public/BlogDetailPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';

// Admin — lazy so the heavy admin/editor/supabase bundle never loads for visitors.
const AdminRoutes = lazy(() => import('@/app/AdminRoutes'));

export function AppRouter() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route index element={<PageGate slug="home"><HomePage /></PageGate>} />
        <Route path="about" element={<PageGate slug="about"><AboutPage /></PageGate>} />
        <Route path="products" element={<PageGate slug="products"><ProductsPage /></PageGate>} />
        <Route path="gallery" element={<PageGate slug="gallery"><GalleryPage /></PageGate>} />
        <Route path="blog" element={<PageGate slug="blog"><BlogPage /></PageGate>} />
        <Route path="blog/:slug" element={<PageGate slug="blog"><BlogDetailPage /></PageGate>} />
        <Route path="contact" element={<PageGate slug="contact"><ContactPage /></PageGate>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin (never gated by the pages control) */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<LoadingState minHeight="100vh" label="Loading admin…" />}>
            <AdminRoutes />
          </Suspense>
        }
      />

      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
