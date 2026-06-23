import { useParams, Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { SmoothImage } from '@/components/common/SmoothImage';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { useBlogPost } from '@/hooks/useBlogs';
import { STRIPE_A } from '@/data/staticSeed';
import { formatDate, readingTime } from '@/lib/formatDate';
import { SITE_DEFAULTS } from '@/data/siteConfig';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, notFound } = useBlogPost(slug);

  const plain = post?.content_html ? post.content_html.replace(/<[^>]+>/g, ' ') : '';

  useSeo({
    title: post?.seo_title || post?.title || 'Article',
    description: post?.seo_description || post?.excerpt || undefined,
    canonicalPath: `/blog/${slug}`,
    type: 'article',
    image: post?.cover_image_url || undefined,
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.published_at,
          author: { '@type': 'Organization', name: post.author || 'Yeshwa' },
          image: post.cover_image_url || undefined,
          mainEntityOfPage: `${SITE_DEFAULTS.siteUrl}/blog/${slug}`,
        }
      : undefined,
  });

  if (loading && !post) {
    return <LoadingState minHeight="60vh" label="Loading article…" />;
  }

  if (notFound || !post) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '100px 40px 140px' }}>
        <EmptyState
          icon="✎"
          title="Article not found"
          description="This post may have been moved or unpublished."
          action={<Link to="/blog" style={linkBtn}>Back to the journal →</Link>}
          minHeight={260}
        />
      </div>
    );
  }

  return (
    <article style={{ maxWidth: 820, margin: '0 auto', padding: '70px 40px 90px' }}>
      <Link to="/blog" style={{ textDecoration: 'none', fontSize: 14, fontWeight: 600, color: COLORS.accent }}>← The journal</Link>

      <div style={{ marginTop: 24 }}>
        {post.category && <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent }}>{post.category}</span>}
        <h1 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 'clamp(34px,5vw,52px)', lineHeight: 1.08, letterSpacing: '-0.015em', margin: '12px 0 18px', color: COLORS.ink }}>
          {post.title}
        </h1>
        <div style={{ fontSize: 14, color: COLORS.muted }}>
          {post.author || 'Yeshwa Studio'} · {post.published_at ? formatDate(post.published_at) : ''}
          {plain && <> · {readingTime(plain)}</>}
        </div>
      </div>

      <SmoothImage
        src={post.cover_image_url}
        alt={post.title}
        placeholder={STRIPE_A}
        placeholderLabel="[ article cover ]"
        eager
        style={{ height: 420, borderRadius: 16, margin: '30px 0 36px' }}
      />

      {post.excerpt && (
        <p style={{ fontFamily: FONTS.serif, fontSize: 22, lineHeight: 1.5, color: COLORS.slate, margin: '0 0 28px' }}>
          {post.excerpt}
        </p>
      )}

      <div
        className="tiptap"
        style={{ fontSize: 17, color: COLORS.slate }}
        dangerouslySetInnerHTML={{ __html: post.content_html || `<p>${post.excerpt ?? ''}</p>` }}
      />

      <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(45,70,84,0.12)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Link to="/blog" style={{ textDecoration: 'none', fontSize: 15, fontWeight: 600, color: COLORS.slate, borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 3 }}>← More articles</Link>
        <Link to="/contact" style={linkBtn}>Book a consultation →</Link>
      </div>
    </article>
  );
}

const linkBtn: React.CSSProperties = {
  textDecoration: 'none',
  background: COLORS.accent,
  color: COLORS.cream,
  fontSize: 15,
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: 999,
};
