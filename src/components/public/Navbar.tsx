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
        className="y-brand-link"
        aria-label="Yeshwa Modular Furniture home"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          flex: "none",
          minWidth: 0,
        }}
      >
        <img
          className="y-logo y-logo-full"
          src="/uploads/primary-logo-hz.png"
          alt="Yeshwa Modular Furniture"
        />

        <img
          className="y-logo y-logo-mark"
          src="/uploads/primary-logo.png"
          alt="Yeshwa"
        />
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
        Contact Us →
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
        .y-brand-link {
          max-width: min(42vw, 270px);
        }

        .y-logo {
          display: block;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }

        .y-logo-full {
          width: clamp(170px, 18vw, 255px);
          height: auto;
          max-height: 58px;
        }

        .y-logo-mark {
          display: none;
          width: 46px;
          height: 46px;
          object-fit: contain;
        }

        .y-nav-link:hover { 
          color: ${COLORS.accent}; 
        }

        .y-cta:hover { 
          background: ${COLORS.accent}; 
        }

        @media (max-width: 1024px) {
          .y-logo-full {
            width: clamp(150px, 24vw, 210px);
            max-height: 52px;
          }

          .y-nav-desktop {
            gap: 24px !important;
          }
        }

        @media (max-width: 860px) {
          .y-nav-desktop { 
            display: none !important; 
          }

          .y-nav-mobile-toggle { 
            display: flex !important; 
          }

          .y-brand-link {
            max-width: 58px;
          }

          .y-logo-full {
            display: none;
          }

          .y-logo-mark {
            display: block;
            width: 48px;
            height: 48px;
          }
        }

        @media (max-width: 420px) {
          .y-logo-mark {
            width: 42px;
            height: 42px;
          }

          .y-nav-mobile-panel {
            padding-left: 22px !important;
            padding-right: 22px !important;
          }
        }
      `}</style>
    </header>
  );
}
