import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface InsightPanelProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Dark (ink) variant for hero-style panels. */
  dark?: boolean;
  /** Entrance stagger delay (ms). */
  delay?: number;
}

/**
 * Card wrapper for dashboard insights. Consistent clamp padding + min-width:0 so
 * charts/tables never overflow the grid on mobile.
 */
export function InsightPanel({ title, subtitle, action, children, dark, delay = 0 }: InsightPanelProps) {
  return (
    <div
      className="y-panel y-admin-rise"
      style={{
        background: dark ? COLORS.ink : '#fff',
        border: dark ? 'none' : '1px solid rgba(45,70,84,0.1)',
        borderRadius: 16,
        padding: 'clamp(16px, 3vw, 24px)',
        minWidth: 0,
        overflow: 'hidden',
        color: dark ? COLORS.cream : COLORS.ink,
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 'clamp(17px, 3vw, 19px)', margin: 0, color: dark ? '#fff' : COLORS.ink }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12.5, color: dark ? COLORS.onDarkMuted : COLORS.warm, margin: '4px 0 0' }}>{subtitle}</p>}
        </div>
        {action && <div style={{ flex: 'none' }}>{action}</div>}
      </div>
      {children}
    </div>
  );
}
