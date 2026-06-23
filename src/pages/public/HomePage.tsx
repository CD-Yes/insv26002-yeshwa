import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo, organizationJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/common/Reveal';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { ServiceCard } from '@/components/public/ServiceCard';
import { CTASection } from '@/components/public/CTASection';
import { GoogleReviews } from '@/components/public/GoogleReviews';
import {
  HOME_STATS,
  HOME_CATEGORIES,
  PROCESS_STEPS,
  CITIES,
  STRIPE_A,
  STRIPE_B,
} from '@/data/staticSeed';

const STRIPE_HERO = 'repeating-linear-gradient(135deg,#D9CBB4 0 1px,#E4D8C2 1px 16px)';

export function HomePage() {
  useSeo({
    title: 'Yeshwa — Modular Furniture Studio',
    description:
      'Custom modular kitchens, wardrobes and whole-home interiors, designed and built in-house. Book a free consultation.',
    canonicalPath: '/',
    jsonLd: organizationJsonLd(),
  });

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          maxWidth: 1340,
          margin: '0 auto',
          padding: '54px 48px 30px',
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div className="hero-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 40, animationDelay: '.05s' }}>
          <span style={eyebrow}>Modular furniture studio</span>
          <span style={eyebrow}>Est. 2014</span>
        </div>
        <h1
          style={{
            fontFamily: FONTS.serif,
            fontWeight: 300,
            fontSize: 'clamp(48px,8vw,116px)',
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
            margin: 0,
            color: COLORS.ink,
            maxWidth: 1100,
          }}
        >
          <span className="hero-in" style={{ display: 'block', animationDelay: '.12s' }}>Furniture made</span>
          <span className="hero-in" style={{ display: 'block', animationDelay: '.22s' }}>to fit the way</span>
          <span className="hero-in" style={{ display: 'block', animationDelay: '.32s' }}>
            you <span style={{ fontStyle: 'italic', color: COLORS.accent }}>actually</span> live.
          </span>
        </h1>
        <div className="hero-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', marginTop: 44, animationDelay: '.44s' }}>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: COLORS.muted, margin: 0, maxWidth: 430 }}>
            Kitchens, wardrobes and whole-home interiors — designed around your space and built in our own facility. Considered furniture, delivered with precision.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <Link to="/contact" data-magnetic className="y-hero-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', background: COLORS.accent, color: COLORS.cream, fontSize: 16, fontWeight: 600, padding: '17px 32px', borderRadius: 999, transition: 'transform .25s ease, background .25s ease' }}>
              Book a consultation →
            </Link>
            <Link to="/products" className="y-hero-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: '#22353F', fontSize: 16, fontWeight: 600, padding: '17px 4px', borderBottom: '2px solid transparent', transition: 'border-color .25s' }}>
              View our work
            </Link>
          </div>
        </div>
        <div className="hero-in" style={{ position: 'absolute', left: 48, bottom: 18, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.warm2, animationDelay: '.56s' }}>
          <span style={{ display: 'block', width: 30, height: 1, background: COLORS.warm2 }} />
          <span style={{ fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Scroll to explore</span>
        </div>
      </section>

      {/* CINEMATIC FULL-BLEED */}
      <section style={{ padding: '0 24px' }}>
        <Reveal className="yzoom" style={{ position: 'relative', height: '64vh', minHeight: 440, borderRadius: 18, overflow: 'hidden', background: '#222' }}>
          <div className="yzoom-img" style={{ position: 'absolute', inset: '-8%', background: STRIPE_HERO }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(22,36,43,0.55),rgba(22,36,43,0.05) 55%)' }} />
          <div style={{ position: 'absolute', left: 40, bottom: 34, right: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>Featured project</span>
              <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.05, color: '#fff', margin: '10px 0 0' }}>The Lakeside Residence — full kitchen &amp; living</h2>
            </div>
            <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'rgba(255,255,255,0.6)', flex: 'none' }}>[ cinematic hero image ]</span>
          </div>
        </Reveal>
      </section>

      {/* CITIES MARQUEE */}
      <section style={{ margin: '46px 0', borderTop: '1px solid rgba(45,70,84,0.12)', borderBottom: '1px solid rgba(45,70,84,0.12)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 'none', padding: '0 28px', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.warm2, borderRight: '1px solid rgba(45,70,84,0.12)', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
            Delivering homes in
          </span>
          <div style={{ overflow: 'hidden', flex: 1, padding: '20px 0' }}>
            <div className="ymarquee-track">
              {[0, 1].map((dup) => (
                <span key={dup} aria-hidden={dup === 1} style={{ display: 'flex', fontFamily: FONTS.serif, fontSize: 26, color: COLORS.muted }}>
                  {CITIES.map((c) => (
                    <span key={c} style={{ display: 'inline-flex' }}>
                      <span style={{ padding: '0 30px' }}>{c}</span>
                      <span style={{ color: COLORS.accent }}>✦</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS / COUNTERS */}
      <section style={{ maxWidth: 1340, margin: '0 auto', padding: '50px 48px 80px' }}>
        <div className="y-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {HOME_STATS.map((s) => (
            <Reveal key={s.label}>
              <AnimatedCounter
                value={s.value}
                style={{ fontFamily: FONTS.serif, fontSize: 'clamp(40px,5vw,62px)', lineHeight: 1, color: COLORS.ink, display: 'block' }}
                accentStyle={{ color: COLORS.accent }}
              />
              <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 10 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MANIFESTO (DARK) */}
      <section style={{ background: COLORS.ink, color: COLORS.cream }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '120px 48px', textAlign: 'center' }}>
          <Reveal as="p" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 30px' }}>
            Our promise
          </Reveal>
          <Reveal as="h2" delay={80} style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(30px,4.6vw,58px)', lineHeight: 1.18, letterSpacing: '-0.01em', margin: 0, color: COLORS.cream }}>
            We don't resell flat-pack furniture. Every panel is designed, cut and finished by our own makers — so the quality, the price and the timeline are all <span style={{ fontStyle: 'italic', color: COLORS.accentLight }}>ours to guarantee.</span>
          </Reveal>
          <Reveal delay={160} style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', marginTop: 54 }}>
            {[
              ['In-house manufacturing', 'Full control, end to end'],
              ['Transparent pricing', 'Itemised, no surprises'],
              ['5-year warranty', 'On every installation'],
            ].map(([t, s], i) => (
              <div key={t} style={{ display: 'contents' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{t}</div>
                  <div style={{ fontSize: 13.5, color: COLORS.onDarkMuted, marginTop: 3 }}>{s}</div>
                </div>
                {i < 2 && <div style={{ width: 1, background: 'rgba(255,255,255,0.16)' }} />}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1340, margin: '0 auto', padding: '110px 48px 50px' }}>
        <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' }}>What we make</p>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(34px,4.4vw,54px)', lineHeight: 1.04, letterSpacing: '-0.01em', margin: 0, color: COLORS.ink }}>
              Modular, down to<br />the last millimetre.
            </h2>
          </div>
          <Link to="/products" className="y-link-orange" style={{ flex: 'none', textDecoration: 'none', fontSize: 15, fontWeight: 600, color: '#22353F', borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 3 }}>
            View all products →
          </Link>
        </Reveal>
        <div className="y-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {HOME_CATEGORIES.map((card, i) => (
            <Reveal key={card.title} delay={(i % 3) * 80} style={card.large ? { gridRow: 'span 2' } : undefined}>
              <ServiceCard card={card} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDITORIAL PROJECTS */}
      <section style={{ maxWidth: 1340, margin: '0 auto', padding: '90px 48px' }}>
        <Reveal style={{ marginBottom: 60 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' }}>Selected work</p>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(34px,4.4vw,54px)', lineHeight: 1.04, margin: 0, color: COLORS.ink }}>Recent projects</h2>
        </Reveal>

        <EditorialProject
          tag="Modular kitchen"
          title="The Lakeside Residence"
          body="A handle-less island kitchen in warm oak and matte stone, designed for a family that cooks together every evening."
          stripe={STRIPE_A}
          label="[ The Lakeside Residence — kitchen ]"
          imageLeft
        />
        <EditorialProject
          tag="Walk-in wardrobe"
          title="The Hillside Apartment"
          body="A full dressing room with glass-front cabinets, integrated lighting and a central island — calm, ordered, every morning."
          stripe={STRIPE_B}
          label="[ The Hillside Apartment — walk-in ]"
          imageLeft={false}
        />
      </section>

      {/* PROCESS */}
      <section style={{ background: COLORS.creamPanel, borderTop: '1px solid rgba(45,70,84,0.08)', borderBottom: '1px solid rgba(45,70,84,0.08)' }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', padding: '100px 48px' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' }}>How it works</p>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(34px,4.4vw,54px)', lineHeight: 1.04, margin: 0, color: COLORS.ink }}>Four steps to a finished home</h2>
          </Reveal>
          <div className="y-process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 30 }}>
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 58, color: COLORS.accent, lineHeight: 1, marginBottom: 20 }}>{step.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: COLORS.ink }}>{step.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: COLORS.muted, margin: 0 }}>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS + MAP */}
      <GoogleReviews />

      {/* CTA */}
      <CTASection
        title={<>Ready to reimagine<br />your space?</>}
        body="Book a free consultation. We'll measure, design in 3D and send an itemised quote — no obligation."
        ctaLabel="Book my consultation →"
        variant="orange"
      />

      <style>{`
        .y-hero-cta:hover { background: ${COLORS.accentHover}; }
        .y-hero-link:hover { border-bottom-color: #22353F; }
        .y-link-orange:hover { color: ${COLORS.accent}; }
        .y-cat-card:hover { transform: translateY(-5px); box-shadow: 0 30px 60px -30px rgba(22,36,43,0.32); }
        @media (max-width: 900px) {
          .y-stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 28px 32px !important; }
          .y-cat-grid { grid-template-columns: 1fr 1fr !important; }
          .y-process-grid { grid-template-columns: 1fr 1fr !important; gap: 36px 30px !important; }
          .y-editorial { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 560px) {
          .y-cat-grid, .y-process-grid, .y-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const eyebrow: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: COLORS.warm,
};

interface EditorialProjectProps {
  tag: string;
  title: string;
  body: string;
  stripe: string;
  label: string;
  imageLeft: boolean;
}

function EditorialProject({ tag, title, body, stripe, label, imageLeft }: EditorialProjectProps) {
  const image = (
    <div className="yzoom" style={{ order: imageLeft ? 1 : 2 }}>
      <div style={{ position: 'relative', height: 520, borderRadius: 16, overflow: 'hidden' }}>
        <div className="yzoom-img" style={{ position: 'absolute', inset: '-6%', background: stripe }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'rgba(45,70,84,0.42)' }}>{label}</span>
        </div>
      </div>
    </div>
  );
  const text = (
    <div style={{ order: imageLeft ? 2 : 1 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, border: `1px solid ${COLORS.accent}`, borderRadius: 999, padding: '6px 14px' }}>{tag}</span>
      <h3 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 38, lineHeight: 1.08, margin: '22px 0 14px', color: COLORS.ink }}>{title}</h3>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: COLORS.muted, margin: '0 0 26px', maxWidth: 420 }}>{body}</p>
      <Link to="/products" className="y-link-orange" style={{ textDecoration: 'none', fontSize: 15, fontWeight: 600, color: '#22353F', borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 3 }}>View project →</Link>
    </div>
  );
  return (
    <Reveal
      className="y-editorial"
      style={{
        display: 'grid',
        gridTemplateColumns: imageLeft ? '1.2fr 0.8fr' : '0.8fr 1.2fr',
        gap: 54,
        alignItems: 'center',
        marginBottom: imageLeft ? 80 : 0,
      }}
    >
      {imageLeft ? <>{image}{text}</> : <>{text}{image}</>}
    </Reveal>
  );
}
