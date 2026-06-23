import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { Reveal } from '@/components/common/Reveal';
import { SmoothImage } from '@/components/common/SmoothImage';
import { BlogCard } from '@/components/public/BlogCard';
import { useBlogs } from '@/hooks/useBlogs';
import { BLOG_CATEGORIES, STRIPE_A } from '@/data/staticSeed';
import { readingTime, formatDate } from '@/lib/formatDate';

export function BlogPage() {
  useSeo({
    title: 'The Yeshwa Journal',
    description: 'Practical ideas for designing a home that works — kitchens, materials, storage and care tips from Yeshwa.',
    canonicalPath: '/blog',
  });

  const { posts } = useBlogs();
  const [category, setCategory] = useState('All');

  const featured = useMemo(
    () => (posts as (typeof posts[number] & { featured?: boolean })[]).find((p) => p.featured) ?? posts[0],
    [posts],
  );
  const rest = useMemo(() => posts.filter((p) => p.id !== featured?.id), [posts, featured]);
  const filtered = useMemo(() => {
    if (category === 'All') return rest;
    return rest.filter((p) => (p.category ?? '').toLowerCase().includes(category.toLowerCase().split(' ')[0]));
  }, [rest, category]);

  return (
    <div>
      {/* HEADER */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 40px 40px' }}>
        <p style={eyebrow}>The Yeshwa journal</p>
        <h1 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.015em', margin: 0, color: '#22353F', maxWidth: 720 }} className="y-hero-title">
          Practical ideas for designing<br />a home that works.
        </h1>
      </section>

      {/* FEATURED */}
      {featured && (
        <section style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 40px 60px' }}>
          <Reveal>
            <Link to={`/blog/${featured.slug}`} className="y-feature" style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 44, alignItems: 'center', background: '#fff', border: '1px solid rgba(45,70,84,0.08)', borderRadius: 18, overflow: 'hidden', transition: 'box-shadow .25s' }}>
              <SmoothImage src={featured.cover_image_url} alt={featured.title} placeholder={STRIPE_A} placeholderLabel="[ featured article cover ]" style={{ height: 400 }} />
              <div className="y-feature-body" style={{ padding: '40px 48px 40px 0' }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: COLORS.accent }}>Featured · {featured.category ?? 'Journal'}</span>
                <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 34, lineHeight: 1.15, margin: '14px 0 16px', color: '#22353F' }}>{featured.title}</h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.7, color: COLORS.muted, margin: '0 0 24px' }}>{featured.excerpt}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: COLORS.muted }}>
                  {featured.content_html ? readingTime(featured.content_html.replace(/<[^>]+>/g, ' ')) : '8 min read'} · {featured.published_at ? formatDate(featured.published_at) : 'Jun 2026'}
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* CATEGORY ROW */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px 32px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {BLOG_CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
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
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px 80px' }}>
        <div className="y-blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '30px 26px' }}>
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <BlogCard post={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ maxWidth: 1320, margin: '0 auto 96px', padding: '0 40px' }}>
        <div className="y-news" style={{ borderRadius: 18, background: COLORS.creamPanel, border: '1px solid rgba(45,70,84,0.1)', padding: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 36, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 34, lineHeight: 1.1, margin: '0 0 8px', color: '#22353F' }}>Get one good idea a month.</h2>
            <p style={{ fontSize: 15.5, color: COLORS.muted, margin: 0 }}>Design tips and project stories. No spam, unsubscribe anytime.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: 'flex', gap: 10, flex: 'none' }}
          >
            <input type="email" required placeholder="you@email.com" style={{ fontSize: 15, padding: '14px 18px', borderRadius: 999, border: '1px solid rgba(45,70,84,0.2)', background: COLORS.cream, color: COLORS.slate, width: 260, outline: 'none' }} />
            <button type="submit" className="y-sub" style={{ cursor: 'pointer', border: 'none', background: COLORS.accent, color: COLORS.cream, fontSize: 15, fontWeight: 600, padding: '14px 26px', borderRadius: 999, transition: 'background .2s' }}>Subscribe</button>
          </form>
        </div>
      </section>

      <style>{`
        .y-feature:hover { box-shadow: 0 24px 50px -24px rgba(34,53,63,0.25); }
        .y-sub:hover { background: ${COLORS.accentHover}; }
        @media (max-width: 900px) {
          .y-blog-grid { grid-template-columns: 1fr 1fr !important; }
          .y-feature { grid-template-columns: 1fr !important; gap: 0 !important; }
          .y-feature-body { padding: 28px 28px 32px !important; }
        }
        @media (max-width: 560px) { .y-blog-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

const eyebrow: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' };
