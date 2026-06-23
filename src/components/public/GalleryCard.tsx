import { SmoothImage } from '@/components/common/SmoothImage';
import { STRIPE_A, STRIPE_B } from '@/data/staticSeed';
import type { GalleryItem } from '@/lib/types';

interface GalleryCardProps {
  item: GalleryItem & { height?: number; tone?: 'a' | 'b' };
  index?: number;
}

/** Masonry gallery tile — ported from Yeshwa-Gallery.dc.html. */
export function GalleryCard({ item, index = 0 }: GalleryCardProps) {
  const stripe = (item.tone ?? (index % 2 === 0 ? 'a' : 'b')) === 'a' ? STRIPE_A : STRIPE_B;
  const height = item.height ?? 300;
  return (
    <div style={{ breakInside: 'avoid', marginBottom: 22 }}>
      <div style={{ position: 'relative', height, borderRadius: 14, overflow: 'hidden', background: stripe }}>
        {item.image_url && (
          <SmoothImage src={item.image_url} alt={item.title} placeholder={stripe} style={{ position: 'absolute', inset: 0, height: '100%' }} />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 18,
            background: 'linear-gradient(to top,rgba(34,53,63,0.5),transparent 50%)',
          }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace,monospace',
              fontSize: 11,
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 600,
            }}
          >
            {item.image_url ? item.title : `[ ${item.title.toLowerCase()} ]`}
          </span>
        </div>
      </div>
    </div>
  );
}
