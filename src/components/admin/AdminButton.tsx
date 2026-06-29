import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '@/data/siteConfig';

type Variant = 'primary' | 'ghost' | 'dark';

interface CommonProps {
  icon: ReactNode;
  label: string;
  variant?: Variant;
  /** Keep the label visible even on mobile (default: collapses to icon-only). */
  alwaysLabel?: boolean;
}

function styleFor(variant: Variant): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: 999,
    cursor: 'pointer',
    border: 'none',
    whiteSpace: 'nowrap',
    transition: 'transform .18s ease, background .2s ease, box-shadow .2s ease',
  };
  if (variant === 'ghost') {
    return { ...base, background: '#fff', color: COLORS.ink, border: '1px solid rgba(45,70,84,0.15)' };
  }
  if (variant === 'dark') {
    return { ...base, background: COLORS.ink, color: COLORS.cream };
  }
  return { ...base, background: COLORS.accent, color: '#fff' };
}

/**
 * Admin action button. Shows an icon + label on desktop and collapses to an
 * icon-only pill on small screens (label hidden, title kept for a11y) — unless
 * `alwaysLabel` is set. Lifts slightly on hover for a premium feel.
 */
function Inner({ icon, label, alwaysLabel }: { icon: ReactNode; label: string; alwaysLabel?: boolean }) {
  return (
    <>
      <span aria-hidden style={{ display: 'inline-flex', fontSize: 15, lineHeight: 1 }}>{icon}</span>
      <span className={alwaysLabel ? undefined : 'y-btn-label'}>{label}</span>
    </>
  );
}

interface LinkProps extends CommonProps {
  to: string;
}
export function AdminButtonLink({ to, icon, label, variant = 'primary', alwaysLabel }: LinkProps) {
  return (
    <Link to={to} className="y-admin-btn" title={label} aria-label={label} style={styleFor(variant)}>
      <Inner icon={icon} label={label} alwaysLabel={alwaysLabel} />
    </Link>
  );
}

interface BtnProps extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {}
export const AdminButton = forwardRef<HTMLButtonElement, BtnProps>(
  ({ icon, label, variant = 'primary', alwaysLabel, ...rest }, ref) => (
    <button ref={ref} className="y-admin-btn" title={label} aria-label={label} style={styleFor(variant)} {...rest}>
      <Inner icon={icon} label={label} alwaysLabel={alwaysLabel} />
    </button>
  ),
);
AdminButton.displayName = 'AdminButton';
