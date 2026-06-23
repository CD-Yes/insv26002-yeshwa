import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface AdminStatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  hintTone?: 'green' | 'muted' | 'accent';
  dark?: boolean;
}

/** KPI card — ported from Yeshwa-Enquiries.dc.html / Analytics. */
export function AdminStatCard({ label, value, hint, hintTone = 'muted', dark }: AdminStatCardProps) {
  const hintColor = dark ? COLORS.accentLight : hintTone === 'green' ? '#2C8A53' : hintTone === 'accent' ? COLORS.accent : COLORS.warm;
  return (
    <div
      style={{
        background: dark ? COLORS.ink : '#fff',
        border: dark ? 'none' : '1px solid rgba(45,70,84,0.1)',
        borderRadius: 14,
        padding: 22,
        color: dark ? COLORS.cream : COLORS.ink,
      }}
    >
      <div style={{ fontSize: 13, color: dark ? COLORS.onDarkMuted : COLORS.muted, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 38, lineHeight: 1, color: dark ? '#fff' : COLORS.ink }}>{value}</div>
      {hint && <div style={{ fontSize: 12.5, color: hintColor, marginTop: 8, fontWeight: 600 }}>{hint}</div>}
    </div>
  );
}
