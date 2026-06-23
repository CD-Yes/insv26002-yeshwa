import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useEnquiries } from '@/hooks/useEnquiries';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { formatShortDate } from '@/lib/formatDate';

interface Counts {
  enquiriesTotal: number;
  enquiriesNew: number;
  blogsPublished: number;
  blogsDraft: number;
  gallery: number;
  projects: number;
  pagesLive: number;
  pagesTotal: number;
}

async function countOf(table: string, filter?: (q: any) => any): Promise<number> {
  if (!supabase) return 0;
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export function AdminDashboardPage() {
  useSeo({ title: 'Admin Dashboard', noindex: true });
  const { enquiries } = useEnquiries();
  const { checks } = useSystemHealth();
  const [c, setC] = useState<Counts | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const [enquiriesTotal, enquiriesNew, blogsPublished, blogsDraft, gallery, projects, pagesLive, pagesTotal] = await Promise.all([
        countOf('enquiries'),
        countOf('enquiries', (q) => q.eq('status', 'new')),
        countOf('blog_posts', (q) => q.eq('status', 'published')),
        countOf('blog_posts', (q) => q.eq('status', 'draft')),
        countOf('gallery_items'),
        countOf('projects'),
        countOf('pages', (q) => q.eq('is_published', true)),
        countOf('pages'),
      ]);
      setC({ enquiriesTotal, enquiriesNew, blogsPublished, blogsDraft, gallery, projects, pagesLive, pagesTotal });
    })();
  }, []);

  const healthOk = checks.filter((h) => h.status === 'ok').length;

  return (
    <div>
      <AdminTopbar eyebrow="Website" title="Dashboard" actions={<Link to="/admin/blogs/new" style={primaryBtn}>+ New blog post</Link>} />

      <div style={{ padding: '30px 32px' }}>
        <div className="y-dash-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 26 }}>
          <AdminStatCard label="Total enquiries" value={c?.enquiriesTotal ?? '—'} hint={`${c?.enquiriesNew ?? 0} new`} hintTone="accent" />
          <AdminStatCard label="Published blogs" value={c?.blogsPublished ?? '—'} hint={`${c?.blogsDraft ?? 0} drafts`} />
          <AdminStatCard label="Gallery & projects" value={`${(c?.gallery ?? 0) + (c?.projects ?? 0)}`} hint={`${c?.gallery ?? 0} gallery · ${c?.projects ?? 0} projects`} />
          <AdminStatCard dark label="Pages live" value={`${c?.pagesLive ?? 0}/${c?.pagesTotal ?? 0}`} hint={`${healthOk} systems healthy`} />
        </div>

        <div className="y-dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
          {/* Latest enquiries */}
          <Panel title="Latest enquiries" action={<Link to="/admin/enquiries" style={linkSmall}>View all →</Link>}>
            {enquiries.length === 0 ? (
              <p style={muted}>No enquiries yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {enquiries.slice(0, 6).map((e) => (
                  <Link key={e.id} to="/admin/enquiries" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(45,70,84,0.07)', textDecoration: 'none' }}>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: COLORS.slate, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flex: 'none' }}>{e.name.slice(0, 1).toUpperCase()}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{e.name}</div>
                      <div style={{ fontSize: 12.5, color: COLORS.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.requirement_type ?? '—'} · {e.location ?? ''}</div>
                    </div>
                    <span style={{ fontSize: 12, color: COLORS.warm }}>{formatShortDate(e.created_at)}</span>
                    <StatusBadge label={e.status} />
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          {/* System health summary */}
          <Panel title="System health" action={<Link to="/admin/system-health" style={linkSmall}>Details →</Link>}>
            {checks.length === 0 ? (
              <p style={muted}>Checking…</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {checks.map((h) => (
                  <div key={h.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: h.status === 'ok' ? '#3FA66A' : h.status === 'down' ? '#D9534F' : '#E8A13E', flex: 'none' }} />
                    <span style={{ fontSize: 13.5, color: COLORS.slate, flex: 1 }}>{h.label}</span>
                    <span style={{ fontSize: 12, color: COLORS.warm, maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) { .y-dash-kpis { grid-template-columns: 1fr 1fr !important; } .y-dash-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 560px) { .y-dash-kpis { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 19, margin: 0, color: COLORS.ink }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

const primaryBtn: React.CSSProperties = { textDecoration: 'none', background: COLORS.accent, color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 18px', borderRadius: 999 };
const linkSmall: React.CSSProperties = { textDecoration: 'none', color: COLORS.accent, fontSize: 13, fontWeight: 600 };
const muted: React.CSSProperties = { fontSize: 14, color: COLORS.muted };
