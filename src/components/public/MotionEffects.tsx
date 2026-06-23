import { useEffect } from 'react';

/**
 * Global pointer flourishes ported from Yeshwa-Home.dc.html:
 *  - a smooth custom cursor follower
 *  - magnetic pull on [data-magnetic] buttons
 * Only active on fine-pointer, hover-capable devices and when motion is allowed.
 * Uses event delegation so it survives route changes (re-render proof).
 */
export function MotionEffects() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (reduce || !canHover) return;

    const dot = document.createElement('div');
    dot.style.cssText =
      'position:fixed;left:-100px;top:-100px;width:30px;height:30px;border:1.5px solid rgba(217,130,74,0.85);border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s;';
    document.body.appendChild(dot);

    let x = innerWidth / 2,
      y = innerHeight / 2,
      cx = x,
      cy = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
      // Magnetic buttons
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
        const r = btn.getBoundingClientRect();
        const pad = 60;
        const inside =
          x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
        if (inside) {
          const mx = x - r.left - r.width / 2;
          const my = y - r.top - r.height / 2;
          btn.style.transform = `translate(${mx * 0.2}px, ${my * 0.3}px)`;
        } else if (btn.style.transform && btn.style.transform !== 'translate(0px, 0px)') {
          btn.style.transform = 'translate(0px, 0px)';
        }
      });
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.('a,button,[data-cursor]')) {
        dot.style.width = '50px';
        dot.style.height = '50px';
        dot.style.background = 'rgba(217,130,74,0.12)';
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest?.('a,button,[data-cursor]')) {
        dot.style.width = '30px';
        dot.style.height = '30px';
        dot.style.background = 'transparent';
      }
    };

    addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      dot.remove();
    };
  }, []);

  return null;
}
