import { useMemo, useState } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { Reveal } from '@/components/common/Reveal';
import { ProjectCard } from '@/components/public/ProjectCard';
import { CTASection } from '@/components/public/CTASection';
import { useProjects } from '@/hooks/useProjects';
import { PRODUCT_FILTERS } from '@/data/staticSeed';

const FINISH_SWATCHES = ['#C9A07A', '#8A6B4F', '#2D4654', '#E9E2D4', '#D9824A', '#6E7F73', '#3A3A3C', '#B8C2BC'];

export function ProductsPage() {
  useSeo({
    title: 'Products & Projects',
    description:
      'Browse Yeshwa product lines — modular kitchens, wardrobes, TV & storage, home offices and full-home interiors.',
    canonicalPath: '/products',
  });

  const { projects } = useProjects();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return projects;
    return projects.filter((p) => {
      const c = (p.category ?? '').toLowerCase();
      const f = filter.toLowerCase();
      return c === f || c.includes(f) || f.includes(c);
    });
  }, [projects, filter]);

  return (
    <div>
      {/* HEADER */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 40px 36px' }}>
        <p style={eyebrow}>Products &amp; projects</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.015em', margin: 0, color: '#22353F', maxWidth: 680 }} className="y-hero-title">
            Everything we build, made<br />to measure for your home.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.muted, margin: 0, maxWidth: 340 }}>
            Browse our core product lines and a selection of recent installs from around the world.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
          {PRODUCT_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
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
                {f}
              </button>
            );
          })}
        </div>
      </section>

      {/* PROJECT GRID */}
      <section style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 40px 80px' }}>
        <div className="y-prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26 }}>
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <ProjectCard project={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* MATERIALS / FINISHES */}
      <section style={{ background: COLORS.creamPanel, borderTop: '1px solid rgba(45,70,84,0.08)', borderBottom: '1px solid rgba(45,70,84,0.08)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '90px 40px' }}>
          <Reveal className="y-finish-split" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <p style={eyebrow}>Finishes &amp; materials</p>
              <h2 style={{ fontFamily: FONTS.serif, fontWeight: 300, fontSize: 40, lineHeight: 1.1, margin: '0 0 20px', color: '#22353F' }}>Choose from 40+ shutters and finishes.</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: COLORS.muted, margin: '0 0 28px' }}>
                Laminates, acrylics, matte and high-gloss membrane, PU paint and real-wood veneers — all on moisture-resistant BWP plywood with branded soft-close hardware.
              </p>
              <a href="/contact" className="y-link-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: COLORS.slate, fontSize: 15, fontWeight: 600, borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 3 }}>
                Request the finishes catalogue →
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {FINISH_SWATCHES.map((c) => (
                <div key={c} style={{ aspectRatio: '1', borderRadius: 10, background: c, border: c === '#E9E2D4' ? '1px solid rgba(45,70,84,0.12)' : undefined }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="See something you like?"
        body="Tell us about your space and we'll design something just like it — built to your exact dimensions."
        ctaLabel="Get my quote →"
        variant="plain"
        maxWidth={1320}
      />

      <style>{`
        .y-link-orange:hover { color: ${COLORS.accent}; }
        @media (max-width: 900px) {
          .y-prod-grid { grid-template-columns: 1fr 1fr !important; }
          .y-finish-split { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 560px) { .y-prod-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

const eyebrow: React.CSSProperties = { fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.accent, margin: '0 0 16px' };
