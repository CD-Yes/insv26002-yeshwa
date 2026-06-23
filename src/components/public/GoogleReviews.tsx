import { COLORS, FONTS } from '@/data/siteConfig';
import { REVIEWS } from '@/data/staticSeed';
import { TestimonialCard } from './TestimonialCard';
import { GoogleMapEmbed } from './GoogleMapEmbed';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Reveal } from '@/components/common/Reveal';

/** Coloured "Google" wordmark used in the reviews badge. */
function GoogleWordmark() {
  const letters: [string, string][] = [
    ['G', '#4285F4'], ['o', '#EA4335'], ['o', '#FBBC05'],
    ['g', '#4285F4'], ['l', '#34A853'], ['e', '#EA4335'],
  ];
  return (
    <span style={{ fontWeight: 700 }}>
      {letters.map(([c, col], i) => (
        <span key={i} style={{ color: col }}>{c}</span>
      ))}
    </span>
  );
}

/**
 * Dark reviews + map section from the home page. Reviews come from seed/site
 * settings (manual cards) since the Google Reviews API is not wired up.
 */
export function GoogleReviews() {
  const { settings } = useSiteSettings();

  return (
    <section style={{ background: COLORS.ink, color: COLORS.cream }}>
      <div style={{ maxWidth: 1340, margin: '0 auto', padding: '100px 48px' }}>
        <div className="y-reviews-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: FONTS.serif, fontSize: 48, lineHeight: 1, color: '#fff' }}>4.9</span>
              <div>
                <div style={{ fontSize: 18, letterSpacing: '0.08em', color: '#F4B23E' }}>★★★★★</div>
                <div style={{ fontSize: 13, color: COLORS.onDarkMuted, marginTop: 4 }}>From 1,200+ verified reviews</div>
              </div>
              <span style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(247,240,230,0.1)', border: '1px solid rgba(247,240,230,0.18)', borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600 }}>
                <GoogleWordmark /> Reviews
              </span>
            </div>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(28px,3.6vw,42px)', lineHeight: 1.1, margin: '0 0 30px', color: '#fff' }}>
              Loved by the families<br />who live with our work.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {REVIEWS.map((r) => (
                <TestimonialCard key={r.name} review={r} />
              ))}
            </div>
            <a href={settings.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="y-reviews-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: COLORS.accentLight, fontSize: 14.5, fontWeight: 600, marginTop: 24 }}>
              Read all reviews on Google →
            </a>
          </Reveal>

          <Reveal delay={120} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <GoogleMapEmbed height={440} grayscale={0.25} style={{ border: '1px solid rgba(247,240,230,0.14)', borderRadius: 16, background: '#1c2c34' }} title="Yeshwa Modular Furniture location" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(247,240,230,0.06)', border: '1px solid rgba(247,240,230,0.12)', borderRadius: 14, padding: '18px 22px' }}>
              <span style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 11, background: COLORS.accent, color: '#fff', fontSize: 20 }}>⌖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Yeshwa Experience Studio</div>
                <div style={{ fontSize: 13.5, color: COLORS.onDarkMuted }}>Visit by appointment · {settings.hours}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`
        .y-reviews-link:hover { color: #fff !important; }
        @media (max-width: 880px) { .y-reviews-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
