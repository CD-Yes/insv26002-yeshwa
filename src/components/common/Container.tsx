import type { CSSProperties, ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  /** Max width — matches the two widths used across the original pages. */
  width?: 1340 | 1320 | 1240 | 1180 | 1100;
  padding?: string;
  style?: CSSProperties;
  className?: string;
}

/** Centered max-width content wrapper (replaces repeated inline max-width blocks). */
export function Container({
  children,
  width = 1320,
  padding = '0 40px',
  style,
  className,
}: ContainerProps) {
  return (
    <div
      className={className}
      style={{ maxWidth: width, margin: '0 auto', padding, ...style }}
    >
      {children}
    </div>
  );
}
