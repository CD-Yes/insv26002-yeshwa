import { useMemo, useState } from 'react';
import { COLORS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { Hero } from '@/components/public/Hero';
import { GalleryCard } from '@/components/public/GalleryCard';
import { CTASection } from '@/components/public/CTASection';
import { useGallery } from '@/hooks/useGallery';
import { GALLERY_ALBUMS } from '@/data/staticSeed';

export function GalleryPage() {
  useSeo({
    title: 'Gallery',
    description: 'A look inside the homes Yeshwa has furnished — real installs by room: kitchens, wardrobes, living rooms and bedrooms.',
    canonicalPath: '/gallery',
  });

  const { items, isFallback } = useGallery();
  const [album, setAlbum] = useState('All albums');

  const filtered = useMemo(() => {
    if (album === 'All albums') return items;
    return items.filter((i) => (i.category ?? '').toLowerCase().includes(album.toLowerCase().replace(/s$/, '')));
  }, [items, album]);

  return (
    <div>
      <Hero
        eyebrow="Gallery & albums"
        title={<>A look inside the homes<br />we've furnished.</>}
        subtitle="Browse finished projects by room. Every photo is a real Yeshwa install — no stock, no renders."
        maxWidth={1320}
      />

      {/* ALBUM PILLS */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px 36px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {GALLERY_ALBUMS.map((a) => {
            const active = a === album;
            return (
              <button
                key={a}
                onClick={() => setAlbum(a)}
                style={{
                  cursor: 'pointer',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: active ? COLORS.cream : COLORS.slate,
                  background: active ? COLORS.slate : 'transparent',
                  border: active ? 'none' : '1px solid rgba(45,70,84,0.2)',
                  borderRadius: 999,
                  padding: '9px 18px',
                  transition: 'all .2s',
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </section>

      {/* MASONRY */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px 80px' }}>
        <div className="y-masonry" style={{ columnCount: 3, columnGap: 22 }}>
          {filtered.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} />
          ))}
        </div>
        {isFallback && (
          <p style={{ textAlign: 'center', fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'rgba(45,70,84,0.5)', marginTop: 8 }}>
            Drop real project photos into these slots — sizes are flexible.
          </p>
        )}
      </section>

      <CTASection
        title="Want your home in this gallery?"
        ctaLabel="Start your project →"
        variant="navy"
        maxWidth={1320}
      />

      <style>{`
        @media (max-width: 900px) { .y-masonry { column-count: 2 !important; } }
        @media (max-width: 560px) { .y-masonry { column-count: 1 !important; } }
      `}</style>
    </div>
  );
}
