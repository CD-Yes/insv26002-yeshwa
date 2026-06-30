import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminButtonLink } from '@/components/admin/AdminButton';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { InsightPanel } from '@/components/admin/charts/InsightPanel';
import { LineChart, type LinePoint } from '@/components/admin/charts/LineChart';
import { BarChart } from '@/components/admin/charts/BarChart';
import { StatusFunnel } from '@/components/admin/charts/StatusFunnel';
import { useEnquiries } from '@/hooks/useEnquiries';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { formatShortDate } from '@/lib/formatDate';
import type { Enquiry } from '@/lib/types';

interface Counts {
  blogsPublished: number;
  blogsDraft: number;
  galleryPublished: number;
  projectsPublished: number;
  pagesLive: number;
  pagesTotal: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countOf(table: string, filter?: (q: any) => any): Promise<number> {
  if (!supabase) return 0;
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Build a per-day enquiry-count series for the last `days` days. */
function buildTrend(enquiries: Enquiry[], days: number): LinePoint[] {
  const buckets = new Map<string, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const points: LinePoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
    points.push({ label: `${MONTHS[d.getMonth()]} ${d.getDate()}`, value: 0 });
  }
  enquiries.forEach((e) => {
    const key = new Date(e.created_at).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  let idx = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    points[idx].value = buckets.get(key) ?? 0;
    idx++;
  }
  return points;
}

export function AdminDashboardPage() {
  useSeo({ title: 'Admin Dashboard', noindex: true });
  const { enquiries } = useEnquiries();
  const { checks } = useSystemHealth();
  const [c, setC] = useState<Counts | null>(null);
  const [range, setRange] = useState<7 | 30>(30);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const [blogsPublished, blogsDraft, galleryPublished, projectsPublished, pagesLive, pagesTotal] = await Promise.all([
        countOf('blog_posts', (q) => q.eq('status', 'published')),
        countOf('blog_posts', (q) => q.eq('status', 'draft')),
        countOf('gallery_items', (q) => q.eq('is_published', true)),
        countOf('projects', (q) => q.eq('is_published', true)),
        countOf('pages', (q) => q.eq('is_published', true)),
        countOf('pages'),
      ]);
      setC({ blogsPublished, blogsDraft, galleryPublished, projectsPublished, pagesLive, pagesTotal });
    })();
  }, []);

  const trend = useMemo(() => buildTrend(enquiries, range), [enquiries, range]);

  const statusRows = useMemo(() => {
    const count = (s: string) => enquiries.filter((e) => e.status === s).length;
    return [
      { label: 'new', value: count('new'), color: '#2D6CD6' },
      { label: 'contacted', value: count('contacted'), color: COLORS.accent },
      { label: 'converted', value: count('converted'), color: '#2C8A53' },
      { label: 'closed', value: count('closed'), color: COLORS.warm },
    ];
  }, [enquiries]);

  const requirementRows = useMemo(() => {
    const map = new Map<string, number>();
    enquiries.forEach((e) => {
      const key = (e.requirement_type ?? 'Unspecified').trim() || 'Unspecified';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map, ([label, value]) => ({ label, value })).slice(0, 8);
  }, [enquiries]);

  const total = enquiries.length;
  const newCount = statusRows[0].value;
  const converted = statusRows[2].value;
  const rate = total ? Math.round((converted / total) * 100) : 0;
  const healthOk = checks.filter((h) => h.status === 'ok').length;

  return (
    <div>
      <AdminTopbar title="Dashboard" actions={<AdminButtonLink to="/admin/blogs/new" icon="✎" label="New blog post" />} />

      <div style={{ padding: 'clamp(20px, 4vw, 30px) clamp(16px, 4vw, 32px)' }}>
        {/* KPI cards */}
        <div className="y-grid-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 16, marginBottom: 22 }}>
          <AdminStatCard delay={0} label="Total enquiries" value={total} hint={`${newCount} new`} hintTone="accent" />
          <AdminStatCard delay={60} label="Conversion rate" value={`${rate}%`} hint={`${converted} won`} hintTone="green" />
          <AdminStatCard delay={120} label="Published blogs" value={c?.blogsPublished ?? '—'} hint={`${c?.blogsDraft ?? 0} drafts`} />
          <AdminStatCard delay={180} dark label="Pages live" value={`${c?.pagesLive ?? 0}/${c?.pagesTotal ?? 0}`} hint={`${healthOk} systems healthy`} />
        </div>

        {/* Row A: trend + funnel */}
        <div className="y-dash-2col" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 20, marginBottom: 20 }}>
          <InsightPanel
            delay={220}
            title="Enquiries over time"
            subtitle={`Last ${range} days`}
            action={
              <div style={{ display: 'flex', gap: 6 }}>
                {([7, 30] as const).map((r) => (
                  <button key={r} onClick={() => setRange(r)} style={toggleBtn(range === r)}>{r}d</button>
                ))}
              </div>
            }
          >
            <LineChart data={trend} />
          </InsightPanel>

          <InsightPanel delay={280} title="Enquiry funnel" subtitle="By status">
            <StatusFunnel rows={statusRows} />
          </InsightPanel>
        </div>

        {/* Row B: requirement breakdown + content health */}
        <div className="y-dash-2col" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20, marginBottom: 20 }}>
          <InsightPanel delay={320} title="Requirement breakdown" subtitle="What people ask for">
            <BarChart rows={requirementRows} emptyLabel="No enquiries yet — categories appear as leads arrive." />
          </InsightPanel>

          <InsightPanel delay={360} title="Content health" subtitle="Manage what's live">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <HealthRow label="Blog posts" value={`${c?.blogsPublished ?? 0} live · ${c?.blogsDraft ?? 0} draft`} to="/admin/blogs" cta="Manage blogs" />
              <HealthRow label="Gallery" value={`${c?.galleryPublished ?? 0} published`} to="/admin/gallery" cta="Manage gallery" />
              <HealthRow label="Projects" value={`${c?.projectsPublished ?? 0} published`} to="/admin/projects" cta="Manage projects" />
              <HealthRow label="Pages" value={`${c?.pagesLive ?? 0}/${c?.pagesTotal ?? 0} live`} to="/admin/pages" cta="Manage pages" />
            </div>
          </InsightPanel>
        </div>

        {/* Row C: latest enquiries + system health */}
        <div className="y-dash-2col" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 20 }}>
          <InsightPanel delay={400} title="Latest enquiries" action={<Link to="/admin/enquiries" style={linkSmall}>View all →</Link>}>
            {enquiries.length === 0 ? (
              <p style={muted}>No enquiries yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {enquiries.slice(0, 6).map((e) => (
                  <Link key={e.id} to="/admin/enquiries" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(45,70,84,0.07)', textDecoration: 'none', minWidth: 0 }}>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: COLORS.slate, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flex: 'none' }}>{e.name.slice(0, 1).toUpperCase()}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                      <div style={{ fontSize: 12.5, color: COLORS.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.requirement_type ?? '—'} · {e.location ?? ''}</div>
                    </div>
                    <span style={{ fontSize: 12, color: COLORS.warm, flex: 'none' }}>{formatShortDate(e.created_at)}</span>
                    <StatusBadge label={e.status} />
                  </Link>
                ))}
              </div>
            )}
          </InsightPanel>

          <InsightPanel delay={440} title="System health" action={<Link to="/admin/system-health" style={linkSmall}>Details →</Link>}>
            {checks.length === 0 ? (
              <p style={muted}>Checking…</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {checks.map((h) => (
                  <div key={h.key} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: h.status === 'ok' ? '#3FA66A' : h.status === 'down' ? '#D9534F' : '#E8A13E', flex: 'none' }} />
                    <span style={{ fontSize: 13.5, color: COLORS.slate, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.label}</span>
                    <span style={{ fontSize: 12, color: COLORS.warm, flex: 'none', maxWidth: 130, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </InsightPanel>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .y-dash-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function HealthRow({ label, value, to, cta }: { label: string; value: string; to: string; cta: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(45,70,84,0.07)', flexWrap: 'wrap', minWidth: 0 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{label}</div>
        <div style={{ fontSize: 12.5, color: COLORS.muted }}>{value}</div>
      </div>
      <Link to={to} style={{ ...linkSmall, flex: 'none' }}>{cta} →</Link>
    </div>
  );
}

const linkSmall: React.CSSProperties = { textDecoration: 'none', color: COLORS.accent, fontSize: 13, fontWeight: 600 };
const muted: React.CSSProperties = { fontSize: 14, color: COLORS.muted };
const toggleBtn = (active: boolean): React.CSSProperties => ({
  cursor: 'pointer',
  border: '1px solid #D8CDB6',
  background: active ? COLORS.ink : '#fff',
  color: active ? COLORS.cream : COLORS.slate,
  borderColor: active ? COLORS.ink : '#D8CDB6',
  fontSize: 12.5,
  fontWeight: 600,
  padding: '5px 11px',
  borderRadius: 999,
});
