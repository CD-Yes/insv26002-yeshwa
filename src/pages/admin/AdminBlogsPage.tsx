import { Link, useNavigate } from 'react-router-dom';
import { COLORS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminButtonLink } from '@/components/admin/AdminButton';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAdminTable } from '@/hooks/useAdminTable';
import { formatShortDate } from '@/lib/formatDate';
import type { BlogPost } from '@/lib/types';

export function AdminBlogsPage() {
  useSeo({ title: 'Blog · Admin', noindex: true });
  const navigate = useNavigate();
  const { rows, loading, setRows } = useAdminTable<BlogPost>('blog_posts', { orderBy: 'updated_at', ascending: false });

  async function togglePublish(p: BlogPost) {
    if (!supabase) return;
    const next = p.status === 'published' ? 'draft' : 'published';
    setRows((l) => l.map((r) => (r.id === p.id ? { ...r, status: next } : r)));
    await supabase.from('blog_posts').update({ status: next, published_at: next === 'published' ? new Date().toISOString() : p.published_at }).eq('id', p.id);
  }

  async function remove(p: BlogPost) {
    if (!supabase || !window.confirm(`Delete "${p.title}"?`)) return;
    setRows((l) => l.filter((r) => r.id !== p.id));
    await supabase.from('blog_posts').delete().eq('id', p.id);
  }

  const columns: Column<BlogPost>[] = [
    { header: 'Title', width: '2.2fr', render: (r) => (
      <div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>{r.title}</div>
        <div style={{ fontSize: 12.5, color: COLORS.warm }}>{r.category ?? 'Uncategorised'}</div>
      </div>
    ) },
    { header: 'Status', width: '1fr', render: (r) => <StatusBadge label={r.status} /> },
    { header: 'Updated', width: '1fr', render: (r) => <span style={{ fontSize: 13, color: COLORS.warm }}>{formatShortDate(r.updated_at)}</span> },
    { header: 'Actions', width: '1.6fr', render: (r) => (
      <div style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => navigate(`/admin/blogs/${r.id}`)} style={ghost}>Edit</button>
        <button onClick={() => togglePublish(r)} style={ghost}>{r.status === 'published' ? 'Unpublish' : 'Publish'}</button>
        <button onClick={() => remove(r)} style={{ ...ghost, color: '#C0392B' }}>Delete</button>
      </div>
    ) },
  ];

  return (
    <div>
      <AdminTopbar title="Blog" actions={<AdminButtonLink to="/admin/blogs/new" icon="✎" label="New post" />} />
      <div style={{ padding: '30px 32px' }}>
        <AdminTable columns={columns} rows={rows} rowKey={(r) => r.id} loading={loading} emptyTitle="No posts yet" emptyDescription="Create your first article." />
        {!loading && rows.length === 0 && <div style={{ marginTop: 16 }}><Link to="/admin/blogs/new" style={{ color: COLORS.accent, fontWeight: 600 }}>+ Write your first post</Link></div>}
      </div>
    </div>
  );
}

const ghost: React.CSSProperties = { cursor: 'pointer', border: '1px solid #D8CDB6', background: '#fff', color: COLORS.ink, fontSize: 13, fontWeight: 600, padding: '7px 13px', borderRadius: 999 };
