import { COLORS } from '@/data/siteConfig';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/**
 * Google Business Profile CTAs (Phase 8): view on Maps, leave a review, get
 * directions. Driven by the google_maps_embed_url / google_reviews_url settings.
 */
export function GoogleBusinessLinks() {
  const { settings } = useSiteSettings();
  const mapsUrl = settings.googleReviewsUrl || 'https://www.google.com/maps';
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address)}`;

  const links = [
    { label: 'View on Google Maps', href: mapsUrl, icon: '⌖' },
    { label: 'Get directions', href: directions, icon: '➤' },
    { label: 'Leave a review', href: settings.googleReviewsUrl, icon: '★' },
  ];

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="y-gbiz"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            fontSize: 13.5,
            fontWeight: 600,
            color: COLORS.slate,
            background: '#fff',
            border: '1px solid rgba(45,70,84,0.18)',
            borderRadius: 999,
            padding: '9px 16px',
            transition: 'border-color .2s, color .2s',
          }}
        >
          <span style={{ color: COLORS.accent }}>{l.icon}</span> {l.label}
        </a>
      ))}
      <style>{`.y-gbiz:hover{ border-color:${COLORS.accent}; color:${COLORS.accent}; }`}</style>
    </div>
  );
}
