import { useEffect, useRef, useState } from 'react';
import { COLORS } from '@/data/siteConfig';

export interface LinePoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LinePoint[];
  height?: number;
  color?: string;
}

/**
 * Lightweight, dependency-free area/line chart. Sizes itself to its container
 * (ResizeObserver) so it stays crisp and never overflows on mobile. Hover or tap
 * reveals the value for a day.
 */
export function LineChart({ data, height = 180, color = COLORS.accent }: LineChartProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setW(Math.max(0, e.contentRect.width));
    });
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const padX = 8;
  const padTop = 14;
  const padBottom = 22;
  const innerW = Math.max(1, w - padX * 2);
  const innerH = Math.max(1, height - padTop - padBottom);
  const n = data.length;
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = n > 1 ? innerW / (n - 1) : 0;

  const x = (i: number) => padX + (n > 1 ? i * step : innerW / 2);
  const y = (v: number) => padTop + innerH * (1 - v / max);

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(' ');
  const areaPath = n > 0
    ? `${linePath} L ${x(n - 1).toFixed(1)} ${(padTop + innerH).toFixed(1)} L ${x(0).toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`
    : '';

  const total = data.reduce((s, d) => s + d.value, 0);

  function onMove(clientX: number) {
    const el = ref.current;
    if (!el || n === 0) return;
    const rect = el.getBoundingClientRect();
    const rel = clientX - rect.left - padX;
    const i = step > 0 ? Math.round(rel / step) : 0;
    setHover(Math.max(0, Math.min(n - 1, i)));
  }

  return (
    <div style={{ minWidth: 0 }}>
      <div
        ref={ref}
        style={{ position: 'relative', width: '100%', touchAction: 'pan-y' }}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => onMove(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={() => setHover(null)}
      >
        {total === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.muted, fontSize: 13.5 }}>
            No enquiries in this period yet.
          </div>
        )}
        {w > 0 && (
          <svg width={w} height={height} style={{ display: 'block' }} role="img" aria-label="Enquiries over time">
            <defs>
              <linearGradient id="yLineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* baseline */}
            <line x1={padX} y1={padTop + innerH} x2={w - padX} y2={padTop + innerH} stroke="rgba(45,70,84,0.12)" strokeWidth="1" />
            {total > 0 && <path key={`area-${n}`} d={areaPath} fill="url(#yLineFill)" className="y-fade-in" style={{ animationDelay: '0.35s' }} />}
            {total > 0 && (
              <path
                key={`line-${n}`}
                d={linePath}
                pathLength={1}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="y-line-draw"
              />
            )}
            {/* points */}
            {data.map((d, i) => (
              <circle key={i} cx={x(i)} cy={y(d.value)} r={hover === i ? 4.5 : 2.5} fill={hover === i ? color : '#fff'} stroke={color} strokeWidth="1.5" />
            ))}
            {/* hover guide */}
            {hover != null && (
              <line x1={x(hover)} y1={padTop} x2={x(hover)} y2={padTop + innerH} stroke={color} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
            )}
          </svg>
        )}

        {/* tooltip */}
        {hover != null && data[hover] && w > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: Math.max(0, Math.min(w - 120, x(hover) - 60)),
              width: 120,
              pointerEvents: 'none',
              background: COLORS.ink,
              color: COLORS.cream,
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
              textAlign: 'center',
              boxShadow: '0 8px 20px -10px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontWeight: 700 }}>{data[hover].value}</div>
            <div style={{ color: COLORS.onDarkMuted, fontSize: 11 }}>{data[hover].label}</div>
          </div>
        )}
      </div>

      {/* sparse x labels (first / mid / last) */}
      {n > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: COLORS.warm }}>
          <span>{data[0].label}</span>
          {n > 2 && <span>{data[Math.floor((n - 1) / 2)].label}</span>}
          <span>{data[n - 1].label}</span>
        </div>
      )}
    </div>
  );
}
