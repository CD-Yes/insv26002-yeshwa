import { COLORS, FONTS } from '@/data/siteConfig';

interface LoadingStateProps {
  label?: string;
  minHeight?: number | string;
}

/** Calm, brand-coloured loading indicator. */
export function LoadingState({ label = 'Loading…', minHeight = 200 }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        minHeight,
        color: COLORS.muted,
        fontFamily: FONTS.sans,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: `2.5px solid rgba(217,130,74,0.25)`,
          borderTopColor: COLORS.accent,
          animation: 'yspin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 14 }}>{label}</span>
      <style>{`@keyframes yspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
