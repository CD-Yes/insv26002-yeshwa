import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Render element/component (default div). */
  as?: ElementType;
  /** Stagger delay in ms (mirrors original data-delay). */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Trigger threshold (0-1). */
  threshold?: number;
  once?: boolean;
}

/**
 * Scroll-reveal wrapper using IntersectionObserver (the reliable cross-browser
 * fallback for the original `data-reveal` view-timeline animation).
 * Honours prefers-reduced-motion by rendering visible immediately.
 */
export function Reveal({
  children,
  as,
  delay = 0,
  className = '',
  style,
  threshold = 0.15,
  once = true,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`y-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ ...style, transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
