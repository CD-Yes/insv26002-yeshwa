import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface AdminStatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  hintTone?: 'green' | 'muted' | 'accent';
  dark?: boolean;
  /** Entrance stagger delay (ms). */
  delay?: number;
}

/** KPI card — ported from Yeshwa-Enquiries.dc.html / Analytics. */
export function AdminStatCard({ label, value, hint, hintTone = 'muted', dark, delay = 0 }: AdminStatCardProps) {
  const hintColor = dark ? COLORS.accentLight : hintTone === 'green' ? '#2C8A53' : hintTone === 'accent' ? COLORS.accent : COLORS.warm;
  return (
    <div
      className="y-card y-admin-rise"
      style={{
        background: dark ? COLORS.ink : '#fff',
        border: dark ? 'none' : '1px solid rgba(45,70,84,0.1)',
        borderRadius: 14,
        padding: 'clamp(16px, 3vw, 22px)',
        color: dark ? COLORS.cream : COLORS.ink,
        minWidth: 0,
        overflow: 'hidden',
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ fontSize: 13, color: dark ? COLORS.onDarkMuted : COLORS.muted, marginBottom: 10, overflowWrap: 'anywhere' }}>{label}</div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 'clamp(30px, 6vw, 38px)', lineHeight: 1, color: dark ? '#fff' : COLORS.ink, overflowWrap: 'anywhere' }}>{value}</div>
      {hint && <div style={{ fontSize: 12.5, color: hintColor, marginTop: 8, fontWeight: 600, overflowWrap: 'anywhere' }}>{hint}</div>}
    </div>
  );
}
