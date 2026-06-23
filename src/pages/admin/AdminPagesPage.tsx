import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { PageStatusToggle } from '@/components/admin/PageStatusToggle';
import { LoadingState } from '@/components/common/LoadingState';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAuth } from '@/app/providers/AuthProvider';
import { logAudit } from '@/lib/audit';
import type { PageRow } from '@/lib/types';

export function AdminPagesPage() {
  useSeo({ title: 'Pages · Admin', noindex: true });
  const { profile } = useAuth();
  const { rows, loading, setRows, refetch } = useAdminTable<PageRow>('pages', { orderBy: 'slug', ascending: true });

  async function toggle(page: PageRow, next: boolean) {
    if (!supabase) return;
    setRows((list) => list.map((p) => (p.id === page.id ? { ...p, is_published: next } : p)));
    const { error } = await supabase.from('pages').update({ is_published: next }).eq('id', page.id);
    if (error) refetch();
    else logAudit(profile?.id ?? null, next ? 'page.publish' : 'page.unpublish', 'pages', page.id, { slug: page.slug });
  }

  return (
    <div>
      <AdminTopbar eyebrow="Website" title="Pages" />
      <div style={{ padding: '30px 32px', maxWidth: 760 }}>
        <p style={{ fontSize: 14.5, color: COLORS.muted, margin: '0 0 22px' }}>
          Toggle public pages live or off. When a page is off, visitors see a clean
          "page unavailable" screen. The admin panel is never affected by these controls.
        </p>

        {loading ? (
          <LoadingState minHeight={200} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rows.map((page) => (
              <div key={page.id} style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 19, margin: '0 0 3px', color: COLORS.ink }}>{page.title}</h3>
                  <p style={{ fontSize: 13, color: COLORS.muted, margin: 0 }}>/{page.slug === 'home' ? '' : page.slug}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: page.is_published ? '#2C8A53' : COLORS.warm }}>
                  {page.is_published ? 'Live' : 'Off'}
                </span>
                <PageStatusToggle on={page.is_published} onChange={(next) => toggle(page, next)} label={`Toggle ${page.title}`} />
              </div>
            ))}
            {rows.length === 0 && (
              <p style={{ fontSize: 14, color: COLORS.muted }}>
                No pages found. Run <code>supabase/seed.sql</code> to create the default pages.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
