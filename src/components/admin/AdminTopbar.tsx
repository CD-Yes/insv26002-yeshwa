import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface AdminTopbarProps {
  eyebrow: ReactNode;
  title: string;
  actions?: ReactNode;
}

/** Sticky admin page header — ported from the reference admin pages. */
export function AdminTopbar({ eyebrow, title, actions }: AdminTopbarProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        padding: '18px 32px',
        background: 'rgba(241,234,220,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45,70,84,0.1)',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: COLORS.warm, fontWeight: 600, letterSpacing: '0.02em' }}>{eyebrow}</div>
        <h1 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 25, margin: '3px 0 0', color: COLORS.ink }}>{title}</h1>
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}
