import { Link } from 'react-router-dom';
import { PUBLIC_NAV, FOOTER_PRODUCTS } from '@/data/navigation';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/** Public footer — ported from YeshwaFooter.dc.html. */
export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer
      style={{
        background: COLORS.navy,
        color: '#D9CFC0',
        fontFamily: FONTS.sans,
        padding: '80px 40px 32px',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="y-foot-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr', gap: 48, paddingBottom: 56, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
              <Link
                  to="/"
                  aria-label="Yeshwa Modular Furniture home"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    textDecoration: 'none',
                    marginBottom: 20,
                  }}
                >
                  <img
                    src="/uploads/primary-logo.png"
                    alt="Yeshwa Modular Furniture"
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: 'contain',
                      display: 'block',
                      flex: 'none',
                    }}
                  />

                  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        color: COLORS.cream,
                        marginTop: 8,
                      }}
                    >
                      YESHWA
                    </span>

                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        // letterSpacing: '0.34em',
                        color: COLORS.accentLight,
                        marginTop: 10,
                      }}
                    >
                      MODULAR FURNITURE
                    </span>
                  </span>
                </Link>
            </div>
            <p style={{ fontFamily: FONTS.serif, fontSize: 24, lineHeight: 1.3, color: COLORS.cream, margin: '0 0 10px', maxWidth: 300 }}>
              <span style={{ color: COLORS.accentLight, fontStyle: 'italic' }}>Yes</span> to better living.
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#A99C8B', margin: 0, maxWidth: 320 }}>
              Custom modular kitchens, wardrobes and storage — designed, manufactured and installed by our own craftspeople.
            </p>
          </div>

          <FooterColumn title="Explore">
            {PUBLIC_NAV.map((i) => (
              <FooterLink key={i.key} to={i.to}>{i.label === 'About' ? 'About us' : i.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Products">
            {FOOTER_PRODUCTS.map((p, i) => (
              <FooterLink key={i} to={p.to}>{p.label}</FooterLink>
            ))}
          </FooterColumn>

          <div>
            <p style={labelStyle}>Our studios</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: '#A99C8B', margin: '0 0 16px' }}>
              {settings.studios.slice(0, 3).join(' · ')}<br />
              {settings.studios.slice(3).join(' · ')}
            </p>
            <a href={`mailto:${settings.email}`} style={{ display: 'block', textDecoration: 'none', color: COLORS.accentLight, fontSize: 14.5, marginBottom: 4 }}>
              {settings.email}
            </a>
            <span style={{ display: 'block', color: '#A99C8B', fontSize: 13.5 }}>Visits by appointment</span>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              {[
                // { label: 'in', href: settings.social.linkedin },
                { label: 'ig', href: settings.social.instagram },
                { label: 'fb', href: settings.social.facebook },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="y-foot-social"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none', color: '#D9CFC0', fontSize: 13, fontWeight: 600 }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 28 }}>
          <p style={{ fontSize: 13, color: '#7E7264', margin: 0 }}>© 2026 Yeshwa Modular Furniture. All rights reserved.</p>
          <p style={{ fontSize: 13, color: '#7E7264', margin: 0 }}>
            Designed &amp; built by{' '}
            <a
              href="https://kalytrex.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: COLORS.accentLight,
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: `1px solid ${COLORS.accentLight}`,
              }}
            >
              KalyTrex
            </a> ·{' '}
            <Link to="/admin" style={{ color: '#7E7264', textDecoration: 'none', borderBottom: '1px solid rgba(126,114,100,0.5)' }}>Admin</Link>
          </p>
        </div>
      </div>

      <style>{`
        .y-foot-link:hover, .y-foot-social:hover { color: ${COLORS.accentLight} !important; }
        .y-foot-social:hover { border-color: ${COLORS.accentLight} !important; }
        @media (max-width: 820px) { .y-foot-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px) { .y-foot-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#7E7264',
  margin: '0 0 20px',
};

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={labelStyle}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="y-foot-link" style={{ textDecoration: 'none', color: '#D9CFC0', fontSize: 14.5 }}>
      {children}
    </Link>
  );
}
