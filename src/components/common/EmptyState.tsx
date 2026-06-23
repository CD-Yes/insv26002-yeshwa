import type { ReactNode } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  minHeight?: number | string;
}

/** Friendly empty placeholder for lists with no data yet. */
export function EmptyState({
  icon = '◇',
  title,
  description,
  action,
  minHeight = 220,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 10,
        minHeight,
        padding: '40px 20px',
        fontFamily: FONTS.sans,
      }}
    >
      <span style={{ fontSize: 30, color: COLORS.accent }}>{icon}</span>
      <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 22, margin: 0, color: COLORS.ink }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14.5, color: COLORS.muted, margin: 0, maxWidth: 360 }}>{description}</p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
