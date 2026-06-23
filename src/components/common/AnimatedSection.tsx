import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from './Reveal';

interface AnimatedSectionProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  /** Disable reveal animation (e.g. hero, above-the-fold). */
  noReveal?: boolean;
  delay?: number;
  id?: string;
}

/**
 * A <section> wrapper that scroll-reveals its content. Thin convenience layer
 * over Reveal so pages read declaratively and motion stays consistent.
 */
export function AnimatedSection({
  children,
  style,
  className,
  noReveal,
  delay,
  id,
}: AnimatedSectionProps) {
  if (noReveal) {
    return (
      <section id={id} className={className} style={style}>
        {children}
      </section>
    );
  }
  return (
    <Reveal as="section" delay={delay} className={className} style={style}>
      {children}
    </Reveal>
  );
}
