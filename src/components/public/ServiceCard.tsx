import { Link } from 'react-router-dom';
import { SmoothImage } from '@/components/common/SmoothImage';
import { COLORS, FONTS } from '@/data/siteConfig';
import type { CategoryCard } from '@/data/staticSeed';

interface ServiceCardProps {
  card: CategoryCard;
  to?: string;
}

const STRIPE_BIG = 'repeating-linear-gradient(135deg,#E0D3BD 0 1px,#EAE0CF 1px 16px)';
const STRIPE_SM = 'repeating-linear-gradient(135deg,#E3D7C2 0 1px,#ECE2D1 1px 16px)';

/** "What we make" category card — ported from Yeshwa-Home.dc.html. */
export function ServiceCard({ card, to = '/products' }: ServiceCardProps) {
  if (card.tone === 'dark') {
    return (
      <Link
        to={to}
        className="y-cat-card"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16,
          overflow: 'hidden',
          background: COLORS.slate,
          border: '1px solid rgba(45,70,84,0.08)',
          transition: 'box-shadow .35s, transform .35s',
        }}
      >
        <div style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', minHeight: 158 }}>
          <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 23, margin: '0 0 6px', color: COLORS.cream }}>{card.title}</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#B9C4CA', margin: '0 0 16px' }}>{card.body}</p>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.accentLight }}>Plan my home →</span>
        </div>
      </Link>
    );
  }

  const big = card.large;
  return (
    <Link
      to={to}
      className="yzoom y-cat-card"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        gridRow: big ? 'span 2' : undefined,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid rgba(45,70,84,0.08)',
        transition: 'box-shadow .35s, transform .35s',
      }}
    >
      <SmoothImage
        src={null}
        alt={card.title}
        placeholder={big ? STRIPE_BIG : STRIPE_SM}
        placeholderLabel={`[ ${card.title.toLowerCase()} ]`}
        className="yzoom-img"
        style={{ height: big ? 380 : 158 }}
      />
      <div style={{ padding: big ? 26 : '22px 24px' }}>
        <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: big ? 27 : 23, margin: '0 0 6px', color: COLORS.ink }}>{card.title}</h3>
        <p style={{ fontSize: big ? 14.5 : 13.5, lineHeight: big ? 1.6 : 1.55, color: COLORS.muted, margin: 0 }}>{card.body}</p>
      </div>
    </Link>
  );
}
