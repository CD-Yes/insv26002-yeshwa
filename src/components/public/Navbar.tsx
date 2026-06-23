import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PUBLIC_NAV } from '@/data/navigation';
import { COLORS, FONTS } from '@/data/siteConfig';

/**
 * Public navbar — ported from YeshwaNav.dc.html.
 * Desktop appearance is preserved exactly; a lightweight hamburger menu is added
 * for narrow screens (the original had no mobile menu and would overflow).
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        padding: '16px 40px',
        background: 'rgba(247,240,230,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(45,70,84,0.12)',
        fontFamily: FONTS.sans,
      }}
    >
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flex: 'none' }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 10,
            background: COLORS.accent,
            color: COLORS.cream,
            fontFamily: FONTS.serif,
            fontWeight: 500,
            fontSize: 26,
            lineHeight: 1,
            paddingBottom: 3,
          }}
        >
          Y
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '0.16em', color: COLORS.slate }}>
            YESHWA
          </span>
          <span style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '0.34em', color: COLORS.warm, marginTop: 4 }}>
            MODULAR FURNITURE
          </span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="y-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        {PUBLIC_NAV.filter((i) => i.key !== 'contact').map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.to === '/'}
            className="y-nav-link"
            style={{
              position: 'relative',
              textDecoration: 'none',
              fontSize: 14.5,
              fontWeight: 500,
              color: COLORS.slate,
              padding: '6px 0',
            }}
          >
            {({ isActive }) => (
              <>
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -2,
                      height: 2,
                      background: COLORS.accent,
                      borderRadius: 2,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/contact"
        className="y-cta y-nav-desktop"
        style={{
          flex: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          textDecoration: 'none',
          background: COLORS.slate,
          color: COLORS.cream,
          fontSize: 14,
          fontWeight: 600,
          padding: '11px 22px',
          borderRadius: 999,
          transition: 'background .2s',
        }}
      >
        Get a quote →
      </Link>

      {/* Mobile hamburger */}
      <button
        aria-label="Toggle menu"
        className="y-nav-mobile-toggle"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'none',
          flexDirection: 'column',
          gap: 5,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 6,
        }}
      >
        <span style={{ width: 22, height: 2, background: COLORS.slate, borderRadius: 2 }} />
        <span style={{ width: 22, height: 2, background: COLORS.slate, borderRadius: 2 }} />
        <span style={{ width: 22, height: 2, background: COLORS.slate, borderRadius: 2 }} />
      </button>

      {open && (
        <div
          className="y-nav-mobile-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(247,240,230,0.98)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1px solid rgba(45,70,84,0.12)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 40px 20px',
            gap: 4,
          }}
        >
          {PUBLIC_NAV.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', fontSize: 16, fontWeight: 500, color: COLORS.slate, padding: '10px 0' }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        .y-nav-link:hover { color: ${COLORS.accent}; }
        .y-cta:hover { background: ${COLORS.accent}; }
        @media (max-width: 860px) {
          .y-nav-desktop { display: none !important; }
          .y-nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
