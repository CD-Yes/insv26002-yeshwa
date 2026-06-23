import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';

type Variant = 'primary' | 'dark' | 'ghost' | 'link';
type Size = 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  style?: CSSProperties;
  className?: string;
  children: React.ReactNode;
}

function styleFor(variant: Variant, size: Size): CSSProperties {
  const pad = size === 'lg' ? '17px 32px' : '13px 24px';
  const fontSize = size === 'lg' ? 16 : 14;
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    textDecoration: 'none',
    fontFamily: FONTS.sans,
    fontWeight: 600,
    fontSize,
    borderRadius: 999,
    cursor: 'pointer',
    border: 'none',
    transition: 'transform .25s ease, background .25s ease, color .25s ease',
  };
  switch (variant) {
    case 'primary':
      return { ...base, padding: pad, background: COLORS.accent, color: COLORS.cream };
    case 'dark':
      return { ...base, padding: pad, background: COLORS.slate, color: COLORS.cream };
    case 'ghost':
      return {
        ...base,
        padding: pad,
        background: 'transparent',
        color: COLORS.slate,
        border: `1px solid rgba(45,70,84,0.2)`,
      };
    case 'link':
      return {
        ...base,
        padding: '4px 0',
        background: 'transparent',
        color: COLORS.slate,
        borderRadius: 0,
        borderBottom: `2px solid ${COLORS.accent}`,
        paddingBottom: 3,
      };
  }
}

interface LinkButtonProps extends BaseProps {
  to: string;
}
type NativeButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** Internal-route button. */
export function LinkButton({
  to,
  variant = 'primary',
  size = 'lg',
  magnetic,
  style,
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={className}
      data-magnetic={magnetic ? '' : undefined}
      style={{ ...styleFor(variant, size), ...style }}
    >
      {children}
    </Link>
  );
}

/** Action button (onClick handlers). */
export const Button = forwardRef<HTMLButtonElement, NativeButtonProps>(
  ({ variant = 'primary', size = 'md', magnetic, style, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={className}
      data-magnetic={magnetic ? '' : undefined}
      style={{ ...styleFor(variant, size), ...style }}
      {...rest}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
