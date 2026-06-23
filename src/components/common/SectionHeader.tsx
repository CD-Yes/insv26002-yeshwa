import type { CSSProperties } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface SectionHeaderProps {
  /** Small uppercase eyebrow label. */
  eyebrow?: string;
  title: React.ReactNode;
  align?: 'left' | 'center';
  titleSize?: string;
  light?: boolean;
  style?: CSSProperties;
}

/** The recurring eyebrow + serif headline block used across pages. */
export function SectionHeader({
  eyebrow,
  title,
  align = 'left',
  titleSize = 'clamp(34px,4.4vw,54px)',
  light = false,
  style,
}: SectionHeaderProps) {
  return (
    <div style={{ textAlign: align, ...style }}>
      {eyebrow && (
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: COLORS.accent,
            margin: '0 0 16px',
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 300,
          fontSize: titleSize,
          lineHeight: 1.04,
          letterSpacing: '-0.01em',
          margin: 0,
          color: light ? COLORS.cream : COLORS.ink,
        }}
      >
        {title}
      </h2>
    </div>
  );
}
