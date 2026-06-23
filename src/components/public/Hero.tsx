import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface HeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  maxWidth?: number;
  titleSize?: string;
  children?: ReactNode;
}

/**
 * Standard page hero (eyebrow + serif headline + optional subtitle), used by
 * About/Products/Gallery/Blog/Contact. The Home page hero is bespoke and lives
 * inline in HomePage.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  maxWidth = 1100,
  titleSize = '56px',
  children,
}: HeroProps) {
  return (
    <section
      style={{
        maxWidth,
        margin: '0 auto',
        padding: align === 'center' ? '90px 40px 44px' : '80px 40px 36px',
        textAlign: align,
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' }}>
        {eyebrow}
      </p>
      <h1
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 300,
          fontSize: titleSize,
          lineHeight: 1.05,
          letterSpacing: '-0.015em',
          margin: subtitle ? '0 0 18px' : 0,
          color: '#22353F',
        }}
        className="y-hero-title"
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.muted, margin: align === 'center' ? '0 auto' : 0, maxWidth: 560 }}>
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
}
