import { COLORS } from '@/data/siteConfig';
import { useBarReveal } from './useBarReveal';

export interface FunnelRow {
  label: string;
  value: number;
  color: string;
}

interface StatusFunnelProps {
  rows: FunnelRow[];
}

/**
 * Horizontal progress/funnel bars with percentages. Pure CSS, fully responsive.
 * Width of each bar is relative to the largest value so the funnel reads clearly.
 * Bars grow from 0 on mount (respects reduced-motion).
 */
export function StatusFunnel({ rows }: StatusFunnelProps) {
  const grown = useBarReveal();
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  const max = Math.max(1, ...rows.map((r) => r.value));

  if (total === 0) {
    return <p style={{ fontSize: 13.5, color: COLORS.muted, margin: 0 }}>No enquiries yet — the funnel fills as leads come in.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map((r, i) => {
        const pct = total ? Math.round((r.value / total) * 100) : 0;
        const w = Math.max(r.value === 0 ? 0 : 6, (r.value / max) * 100);
        return (
          <div key={r.label} style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.slate, textTransform: 'capitalize' }}>{r.label}</span>
              <span style={{ fontSize: 13, color: COLORS.warm, flex: 'none' }}>{r.value} · {pct}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, background: 'rgba(45,70,84,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  width: grown ? `${w}%` : '0%',
                  height: '100%',
                  borderRadius: 999,
                  background: r.color,
                  transition: 'width .7s cubic-bezier(.22,.7,.2,1)',
                  transitionDelay: `${i * 70}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
