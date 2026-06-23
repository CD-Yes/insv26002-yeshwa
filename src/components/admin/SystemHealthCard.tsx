import { COLORS } from '@/data/siteConfig';
import type { HealthCheck } from '@/hooks/useSystemHealth';

const TONE: Record<HealthCheck['status'], { dot: string; label: string }> = {
  ok: { dot: '#3FA66A', label: 'Healthy' },
  warn: { dot: '#E8A13E', label: 'Attention' },
  down: { dot: '#D9534F', label: 'Down' },
  unknown: { dot: '#9A8B76', label: 'Unknown' },
};

/** One connected-system health row/card for the System Health page. */
export function SystemHealthCard({ check }: { check: HealthCheck }) {
  const tone = TONE[check.status];
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <span style={{ flex: 'none', width: 10, height: 10, borderRadius: '50%', background: tone.dot, marginTop: 6 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>{check.label}</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 3, wordBreak: 'break-word' }}>{check.detail}</div>
      </div>
      <span style={{ marginLeft: 'auto', flex: 'none', fontSize: 12, fontWeight: 700, color: tone.dot }}>{tone.label}</span>
    </div>
  );
}
