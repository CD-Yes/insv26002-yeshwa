import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';

interface CTASectionProps {
  title: React.ReactNode;
  body?: React.ReactNode;
  ctaLabel: string;
  ctaTo?: string;
  /** 'orange' = home hero CTA; 'navy' = about/gallery CTA; 'plain' = products centered. */
  variant?: 'orange' | 'navy' | 'plain';
  maxWidth?: number;
}

/** Recurring call-to-action block (orange splash / navy panel / plain centered). */
export function CTASection({
  title,
  body,
  ctaLabel,
  ctaTo = '/contact',
  variant = 'orange',
  maxWidth = 1340,
}: CTASectionProps) {
  if (variant === 'plain') {
    return (
      <section style={{ maxWidth, margin: '0 auto', padding: '90px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 42, lineHeight: 1.1, margin: '0 0 14px', color: '#22353F' }}>{title}</h2>
        {body && <p style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.muted, margin: '0 auto 30px', maxWidth: 480 }}>{body}</p>}
        <Link to={ctaTo} data-magnetic style={primaryBtn}>{ctaLabel}</Link>
      </section>
    );
  }

  if (variant === 'navy') {
    return (
      <section style={{ maxWidth, margin: '0 auto 96px', padding: '0 40px' }}>
        <div style={{ borderRadius: 18, background: COLORS.slate, padding: '72px 56px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 42, lineHeight: 1.1, margin: '0 0 14px', color: COLORS.cream }}>{title}</h2>
          {body && <p style={{ fontSize: 17, lineHeight: 1.6, color: '#B9C4CA', margin: '0 auto 32px', maxWidth: 520 }}>{body}</p>}
          <Link to={ctaTo} data-magnetic style={primaryBtn}>{ctaLabel}</Link>
        </div>
      </section>
    );
  }

  // orange
  return (
    <section style={{ maxWidth, margin: '96px auto', padding: '0 48px' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 22,
          background: COLORS.accent,
          padding: '84px 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 40,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'absolute', right: -70, top: -70, width: 320, height: 320, borderRadius: '50%', background: 'rgba(247,240,230,0.12)' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(32px,4vw,50px)', lineHeight: 1.05, margin: '0 0 16px', color: '#FFF7EE' }}>{title}</h2>
          {body && <p style={{ fontSize: 17, lineHeight: 1.6, color: '#FFE9D6', margin: 0, maxWidth: 480 }}>{body}</p>}
        </div>
        <Link
          to={ctaTo}
          data-magnetic
          style={{ position: 'relative', flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', background: COLORS.ink, color: COLORS.cream, fontSize: 16, fontWeight: 600, padding: '18px 36px', borderRadius: 999, transition: 'transform .25s ease' }}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  background: COLORS.accent,
  color: COLORS.cream,
  fontSize: 16,
  fontWeight: 600,
  padding: '16px 34px',
  borderRadius: 999,
  transition: 'background .2s',
};
