import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { Hero } from '@/components/public/Hero';
import { Reveal } from '@/components/common/Reveal';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { CTASection } from '@/components/public/CTASection';
import { ABOUT_STATS } from '@/data/staticSeed';

const VALUES = [
  ['Honest pricing', 'Itemised quotes, no inflated MRPs, no surprise add-ons after you sign.'],
  ['Built to last', 'BWP-grade ply and branded hardware, backed by a 5-year warranty.'],
  ['On time, always', '45-day delivery written into your contract — and we keep it.'],
];

const TEAM = [
  ['Founder & CEO', 'Yeshwa Modular Furniture'],
  ['Head of Design', 'Interiors & space planning'],
  ['Production Lead', 'Manufacturing & QC'],
  ['Install Manager', 'On-site & handover'],
];

const STRIPE_WIDE = 'repeating-linear-gradient(135deg,#E6DAC6 0 1px,#EFE5D5 1px 15px)';
const STRIPE_SOFT = 'repeating-linear-gradient(135deg,#E3D7C2 0 1px,#ECE2D1 1px 15px)';

export function AboutPage() {
  useSeo({
    title: 'About Yeshwa',
    description:
      'Yeshwa builds modular furniture honestly — designed, manufactured and installed in our own 40,000 sq ft facility.',
    canonicalPath: '/about',
  });

  return (
    <div>
      <Hero
        eyebrow="About Yeshwa"
        title={<>We build furniture the way it<br />should be built — <span style={{ fontStyle: 'italic', color: COLORS.accent }}>honestly.</span></>}
        subtitle="Yeshwa started with a simple frustration: modular furniture was either overpriced and over-marketed, or cheap and short-lived. We decided to do both better — by making everything ourselves."
        titleSize="60px"
        maxWidth={1100}
      />

      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px 20px' }}>
        <Reveal style={{ position: 'relative', height: 460, borderRadius: 16, overflow: 'hidden', background: STRIPE_WIDE }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={mono}>[ wide shot — Yeshwa manufacturing facility ]</span>
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '64px 40px' }}>
        <div className="y-about-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, borderTop: '1px solid rgba(45,70,84,0.12)', borderBottom: '1px solid rgba(45,70,84,0.12)', padding: '48px 0' }}>
          {ABOUT_STATS.map((s) => (
            <div key={s.label}>
              <AnimatedCounter value={s.value} style={{ fontFamily: FONTS.serif, fontSize: 46, color: '#22353F', lineHeight: 1, display: 'block' }} accentStyle={{ color: COLORS.accent }} />
              <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY SPLIT */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 40px' }}>
        <Reveal className="y-about-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={eyebrowOrange}>Our story</p>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 40, lineHeight: 1.12, margin: '0 0 22px', color: '#22353F' }}>From a single workshop to a full facility.</h2>
            <p style={para}>We began in 2014 as a small carpentry workshop taking on one kitchen at a time. As word spread, families kept asking for the same thing — quality they could trust and prices they could understand.</p>
            <p style={{ ...para, margin: 0 }}>Today, Yeshwa runs a 40,000 sq ft manufacturing facility where every cabinet, shutter and wardrobe is built under one roof. We still treat each home like our first.</p>
          </div>
          <div style={{ position: 'relative', height: 440, borderRadius: 14, overflow: 'hidden', background: STRIPE_SOFT }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={mono}>[ founders / early workshop photo ]</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* VALUES */}
      <section style={{ background: COLORS.creamPanel, borderTop: '1px solid rgba(45,70,84,0.08)', borderBottom: '1px solid rgba(45,70,84,0.08)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '90px 40px' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 54 }}>
            <p style={eyebrowOrange}>What we stand for</p>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 44, lineHeight: 1.08, margin: 0, color: '#22353F' }}>Values we won't compromise</h2>
          </Reveal>
          <div className="y-values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {VALUES.map(([title, body], i) => (
              <Reveal key={title} delay={i * 80} style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.08)', borderRadius: 14, padding: 30 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: COLORS.accent, transform: 'rotate(45deg)', marginBottom: 20 }} />
                <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 23, margin: '0 0 10px', color: '#22353F' }}>{title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: COLORS.muted, margin: 0 }}>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '90px 40px' }}>
        <Reveal style={{ marginBottom: 48 }}>
          <p style={eyebrowOrange}>The people</p>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 44, lineHeight: 1.08, margin: 0, color: '#22353F' }}>Designers, makers, installers</h2>
        </Reveal>
        <div className="y-team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {TEAM.map(([role, sub], i) => (
            <Reveal key={role} delay={(i % 4) * 60}>
              <div style={{ position: 'relative', height: 300, borderRadius: 12, overflow: 'hidden', background: STRIPE_WIDE, marginBottom: 16 }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={mono}>[ portrait ]</span>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#22353F' }}>{role}</div>
              <div style={{ fontSize: 13.5, color: COLORS.muted }}>{sub}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        title="Come see how we make it."
        body="Visit one of our studios, or book a free home consultation with our design team."
        ctaLabel="Book a consultation →"
        variant="navy"
        maxWidth={1320}
      />

      <style>{`
        @media (max-width: 900px) {
          .y-about-stats { grid-template-columns: repeat(2,1fr) !important; gap: 28px 32px !important; }
          .y-about-split { grid-template-columns: 1fr !important; gap: 32px !important; }
          .y-values-grid { grid-template-columns: 1fr !important; }
          .y-team-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .y-about-stats, .y-team-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const mono: React.CSSProperties = { fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'rgba(45,70,84,0.45)' };
const eyebrowOrange: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 14px' };
const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.75, color: COLORS.muted, margin: '0 0 18px' };
