import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';

/** Shown when an admin has toggled a public page off. */
export function PageDisabled() {
  useSeo({ title: 'Page unavailable', description: 'This page is currently unavailable.', noindex: true });

  return (
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '120px 40px 140px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 18px' }}>
        Yeshwa Modular Furniture
      </p>
      <h1 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.08, margin: '0 0 18px', color: COLORS.ink }}>
        This page is currently<br />unavailable.
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.muted, margin: '0 auto 32px', maxWidth: 440 }}>
        We're updating this section. Please check back shortly — or get in touch and we'll help you directly.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ textDecoration: 'none', background: COLORS.accent, color: COLORS.cream, fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 999 }}>
          Back to home
        </Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: COLORS.slate, fontSize: 15, fontWeight: 600, padding: '14px 4px', borderBottom: `2px solid ${COLORS.accent}` }}>
          Contact us →
        </Link>
      </div>
    </section>
  );
}
