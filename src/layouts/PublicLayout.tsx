import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { WhatsAppButton } from '@/components/public/WhatsAppButton';
import { MotionEffects } from '@/components/public/MotionEffects';
import { COLORS, FONTS } from '@/data/siteConfig';

/** Scroll to top on route change (SPA navigation). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

/**
 * Shared public shell: Navbar + page + Footer + floating WhatsApp + motion.
 * Chrome is defined once here (never copied into individual pages).
 */
export function PublicLayout() {
  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        background: COLORS.cream,
        color: '#22353F',
        overflowX: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ScrollToTop />
      <MotionEffects />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
