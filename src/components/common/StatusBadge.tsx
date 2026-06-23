import type { CSSProperties } from 'react';

type Tone = 'green' | 'blue' | 'purple' | 'amber' | 'grey';

const TONES: Record<Tone, { bg: string; color: string }> = {
  green: { bg: 'rgba(63,166,106,0.16)', color: '#2C8A53' },
  blue: { bg: 'rgba(66,133,244,0.14)', color: '#2D6CD6' },
  purple: { bg: 'rgba(155,120,200,0.16)', color: '#7C57B0' },
  amber: { bg: 'rgba(229,145,90,0.16)', color: '#C26E38' },
  grey: { bg: 'rgba(138,122,102,0.16)', color: '#8a7a66' },
};

/** Map an enquiry/post status string to a colour tone. */
export function toneForStatus(status: string): Tone {
  switch (status.toLowerCase()) {
    case 'new':
      return 'blue';
    case 'contacted':
    case 'in progress':
      return 'amber';
    case 'quoted':
      return 'purple';
    case 'converted':
    case 'won':
    case 'published':
      return 'green';
    default:
      return 'grey';
  }
}

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
  style?: CSSProperties;
}

export function StatusBadge({ label, tone, style }: StatusBadgeProps) {
  const t = TONES[tone ?? toneForStatus(label)];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 11px',
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {label}
    </span>
  );
}
