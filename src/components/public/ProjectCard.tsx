import { Link } from 'react-router-dom';
import { SmoothImage } from '@/components/common/SmoothImage';
import { STRIPE_A, STRIPE_B } from '@/data/staticSeed';
import { COLORS, FONTS } from '@/data/siteConfig';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  to?: string;
  index?: number;
}

/** Products grid card — ported from Yeshwa-Products.dc.html. */
export function ProjectCard({ project, to = '/contact', index = 0 }: ProjectCardProps) {
  const stripe = index % 2 === 0 ? STRIPE_A : STRIPE_B;
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }} className="yzoom">
      <div style={{ position: 'relative', height: 300, borderRadius: 14, overflow: 'hidden' }}>
        <SmoothImage
          src={project.cover_image_url}
          alt={project.title}
          placeholder={stripe}
          placeholderLabel={`[ ${project.title.toLowerCase()} ]`}
          className="yzoom-img"
          style={{ position: 'absolute', inset: 0, height: '100%' }}
        />
        {project.category && (
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              fontSize: 11.5,
              fontWeight: 600,
              color: '#fff',
              background: 'rgba(34,53,63,0.7)',
              borderRadius: 999,
              padding: '5px 12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            {project.category}
          </span>
        )}
      </div>
      <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 21, margin: '16px 0 4px', color: '#22353F' }}>
        {project.title}
      </h3>
      {project.location && (
        <p style={{ fontSize: 13.5, color: COLORS.muted, margin: 0 }}>{project.location}</p>
      )}
    </Link>
  );
}
