import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface AnimatedCounterProps {
  /** Full display value e.g. "5,000+", "4.9★", "40,000 sq ft". */
  value: string;
  style?: CSSProperties;
  accentStyle?: CSSProperties;
}

/**
 * Counts a numeric prefix up from 0 when scrolled into view, then restores the
 * exact original string (including suffix like "+", "★", " sq ft").
 * Mirrors the counter behaviour in the original home page script and respects
 * reduced-motion (renders the final value immediately).
 */
export function AnimatedCounter({ value, style, accentStyle }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);
  const done = useRef(false);

  // Split "12,345" + "rest" — numeric prefix vs suffix.
  const match = value.match(/^([\d,.]+)(.*)$/);
  const numericStr = match ? match[1].replace(/,/g, '') : '';
  const suffix = match ? match[2] : value;
  const target = parseFloat(numericStr);
  const isDecimal = numericStr.includes('.');
  const animatable = match != null && !Number.isNaN(target);

  useEffect(() => {
    if (!animatable) return;
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    setDisplay('0' + suffix);

    const run = () => {
      if (done.current) return;
      done.current = true;
      const dur = 1500;
      const start = performance.now();
      const step = (now: number) => {
        let p = Math.min(1, (now - start) / dur);
        p = 1 - Math.pow(1 - p, 3);
        const val = target * p;
        const text = (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
        setDisplay(text);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render the suffix accent (e.g. orange "+") to match the original markup.
  const splitMatch = display.match(/^([\d,.]+)(.*)$/);
  return (
    <span ref={ref} style={style}>
      {splitMatch ? (
        <>
          {splitMatch[1]}
          <span style={accentStyle}>{splitMatch[2]}</span>
        </>
      ) : (
        display
      )}
    </span>
  );
}
