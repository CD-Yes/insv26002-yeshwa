import { COLORS } from '@/data/siteConfig';
import { useBarReveal } from './useBarReveal';

export interface BarRow {
  label: string;
  value: number;
}

interface BarChartProps {
  rows: BarRow[];
  color?: string;
  emptyLabel?: string;
}

/**
 * Horizontal ranked bar list — ideal for category breakdowns and naturally
 * mobile-friendly (labels wrap, bars fill available width). Dependency-free.
 * Bars grow from 0 on mount (respects reduced-motion).
 */
export function BarChart({ rows, color = COLORS.accent, emptyLabel = 'No data yet.' }: BarChartProps) {
  const grown = useBarReveal();
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const max = Math.max(1, ...sorted.map((r) => r.value));

  if (sorted.length === 0 || max === 0) {
    return <p style={{ fontSize: 13.5, color: COLORS.muted, margin: 0 }}>{emptyLabel}</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sorted.map((r, i) => {
        const w = Math.max(r.value === 0 ? 0 : 4, (r.value / max) * 100);
        return (
          <div key={r.label} style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: COLORS.slate, overflowWrap: 'anywhere', minWidth: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, flex: 'none' }}>{r.value}</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(45,70,84,0.07)', overflow: 'hidden' }}>
              <div
                style={{
                  width: grown ? `${w}%` : '0%',
                  height: '100%',
                  borderRadius: 999,
                  background: color,
                  transition: 'width .7s cubic-bezier(.22,.7,.2,1)',
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
