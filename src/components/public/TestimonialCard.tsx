import { COLORS } from '@/data/siteConfig';
import type { Review } from '@/data/staticSeed';

/** Review card on the dark reviews section — ported from Yeshwa-Home.dc.html. */
export function TestimonialCard({ review }: { review: Review }) {
  return (
    <div
      style={{
        background: 'rgba(247,240,230,0.06)',
        border: '1px solid rgba(247,240,230,0.12)',
        borderRadius: 14,
        padding: 22,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: review.avatarColor,
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          {review.initial}
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14.5, color: '#fff' }}>{review.name}</div>
          <div style={{ fontSize: 12, color: COLORS.onDarkMuted }}>{review.when}</div>
        </div>
        <span style={{ marginLeft: 'auto', color: '#F4B23E', fontSize: 13 }}>★★★★★</span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: '#D9CFC0', margin: 0 }}>{review.text}</p>
    </div>
  );
}
