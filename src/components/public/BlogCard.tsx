import { Link } from 'react-router-dom';
import { SmoothImage } from '@/components/common/SmoothImage';
import { STRIPE_A, STRIPE_B } from '@/data/staticSeed';
import { COLORS, FONTS } from '@/data/siteConfig';
import { readingTime } from '@/lib/formatDate';
import type { BlogPost } from '@/lib/types';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

/** Blog grid card — ported from Yeshwa-Blog.dc.html. */
export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const stripe = index % 2 === 0 ? STRIPE_A : STRIPE_B;
  const minutes = post.content_html
    ? readingTime(post.content_html.replace(/<[^>]+>/g, ' '))
    : '5 min read';
  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <SmoothImage
        src={post.cover_image_url}
        alt={post.title}
        placeholder={stripe}
        placeholderLabel="[ cover ]"
        style={{ height: 220, borderRadius: 12, marginBottom: 16 }}
      />
      {post.category && (
        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent }}>{post.category}</span>
      )}
      <h3
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 400,
          fontSize: 21,
          margin: '8px 0',
          color: '#22353F',
          lineHeight: 1.25,
        }}
      >
        {post.title}
      </h3>
      <p style={{ fontSize: 13, color: COLORS.muted, margin: 0 }}>{minutes}</p>
    </Link>
  );
}
