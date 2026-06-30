import { useEffect, useState } from 'react';

/**
 * Returns false on first paint, then true on the next frame so width/transform
 * transitions animate from their zero state. Returns true immediately when the
 * user prefers reduced motion (no animation).
 */
export function useBarReveal(): boolean {
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGrown(true);
      return;
    }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setGrown(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  return grown;
}
