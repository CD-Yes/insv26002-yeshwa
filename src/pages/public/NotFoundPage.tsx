import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';

export function NotFoundPage() {
  useSeo({ title: 'Page not found', noindex: true });
  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '120px 40px 150px', textAlign: 'center' }}>
      <p style={{ fontFamily: FONTS.serif, fontSize: 'clamp(80px,14vw,160px)', lineHeight: 1, margin: 0, color: COLORS.accent }}>404</p>
      <h1 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 36, margin: '8px 0 16px', color: COLORS.ink }}>This page wandered off.</h1>
      <p style={{ fontSize: 17, color: COLORS.muted, margin: '0 auto 30px', maxWidth: 420 }}>
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" style={{ textDecoration: 'none', background: COLORS.accent, color: COLORS.cream, fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 999 }}>
        Back to home
      </Link>
    </section>
  );
}
