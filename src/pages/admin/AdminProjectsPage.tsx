import { useState } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminButton } from '@/components/admin/AdminButton';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { PageStatusToggle } from '@/components/admin/PageStatusToggle';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { SmoothImage } from '@/components/common/SmoothImage';
import { useAdminTable } from '@/hooks/useAdminTable';
import { uniqueSlug } from '@/lib/slug';
import { PRODUCT_FILTERS, STRIPE_A } from '@/data/staticSeed';
import type { Project } from '@/lib/types';

const CATEGORIES = PRODUCT_FILTERS.filter((c) => c !== 'All');
const emptyDraft = { title: '', category: CATEGORIES[0], location: '', description: '', materials: '', cover_image_url: '', cover_image_key: '', is_featured: false };

export function AdminProjectsPage() {
  useSeo({ title: 'Projects · Admin', noindex: true });
  const { rows, loading, refetch, setRows } = useAdminTable<Project>('projects');
  const [editing, setEditing] = useState<typeof emptyDraft & { id?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!supabase || !editing || !editing.title.trim()) return;
    setSaving(true);
    const payload = {
      title: editing.title.trim(),
      category: editing.category,
      location: editing.location || null,
      description: editing.description || null,
      materials: editing.materials || null,
      cover_image_url: editing.cover_image_url || null,
      cover_image_key: editing.cover_image_key || null,
      is_featured: editing.is_featured,
    };
    if (editing.id) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('projects').insert({ ...payload, slug: uniqueSlug(editing.title, rows.map((r) => r.slug)), is_published: true });
    }
    setSaving(false);
    setEditing(null);
    refetch();
  }

  async function togglePublish(p: Project, next: boolean) {
    if (!supabase) return;
    setRows((l) => l.map((r) => (r.id === p.id ? { ...r, is_published: next } : r)));
    await supabase.from('projects').update({ is_published: next }).eq('id', p.id);
  }

  async function remove(p: Project) {
    if (!supabase || !window.confirm(`Delete "${p.title}"?`)) return;
    setRows((l) => l.filter((r) => r.id !== p.id));
    await supabase.from('projects').delete().eq('id', p.id);
  }

  return (
    <div>
      <AdminTopbar title="Projects" actions={<AdminButton onClick={() => setEditing({ ...emptyDraft })} icon="＋" label="New project" />} />
      <div style={{ padding: '30px 32px' }}>
        {loading ? (
          <LoadingState minHeight={200} />
        ) : rows.length === 0 ? (
          <EmptyState icon="▤" title="No projects yet" description="Add your first portfolio project." action={<button onClick={() => setEditing({ ...emptyDraft })} style={primaryBtn}>+ New project</button>} />
        ) : (
          <div className="y-proj-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {rows.map((p) => (
              <div key={p.id} style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 14, overflow: 'hidden' }}>
                <SmoothImage src={p.cover_image_url} alt={p.title} placeholder={STRIPE_A} placeholderLabel={`[ ${p.title} ]`} style={{ height: 160 }} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}{p.is_featured && <span style={{ color: COLORS.accent }}> ★</span>}</div>
                      <div style={{ fontSize: 12.5, color: COLORS.warm }}>{p.category} · {p.location ?? ''}</div>
                    </div>
                    <PageStatusToggle on={p.is_published} onChange={(n) => togglePublish(p, n)} label="Publish" />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setEditing({ id: p.id, title: p.title, category: p.category ?? CATEGORIES[0], location: p.location ?? '', description: p.description ?? '', materials: p.materials ?? '', cover_image_url: p.cover_image_url ?? '', cover_image_key: p.cover_image_key ?? '', is_featured: p.is_featured })} style={ghostBtn}>Edit</button>
                    <button onClick={() => remove(p)} style={{ ...ghostBtn, color: '#C0392B' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing.id ? 'Edit project' : 'New project'} onClose={() => setEditing(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {editing.cover_image_url ? (
              <div style={{ position: 'relative' }}>
                <SmoothImage src={editing.cover_image_url} alt="cover" style={{ height: 160, borderRadius: 12 }} />
                <button onClick={() => setEditing((e) => e && { ...e, cover_image_url: '', cover_image_key: '' })} style={{ position: 'absolute', top: 8, right: 8, border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>Replace</button>
              </div>
            ) : (
              <MediaUploader purpose="projects" onUploaded={(r) => setEditing((e) => e && { ...e, cover_image_url: r.public_url, cover_image_key: r.file_key })} />
            )}
            <input className="ya-field" placeholder="Title" value={editing.title} onChange={(e) => setEditing((d) => d && { ...d, title: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <select className="ya-field" value={editing.category} onChange={(e) => setEditing((d) => d && { ...d, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
              <input className="ya-field" placeholder="Location" value={editing.location} onChange={(e) => setEditing((d) => d && { ...d, location: e.target.value })} />
            </div>
            <textarea className="ya-field" rows={3} placeholder="Description" value={editing.description} onChange={(e) => setEditing((d) => d && { ...d, description: e.target.value })} />
            <input className="ya-field" placeholder="Materials (e.g. oak, matte stone)" value={editing.materials} onChange={(e) => setEditing((d) => d && { ...d, materials: e.target.value })} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: COLORS.slate }}>
              <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing((d) => d && { ...d, is_featured: e.target.checked })} /> Featured project
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(null)} style={ghostBtn}>Cancel</button>
              <button onClick={save} disabled={saving || !editing.title.trim()} style={{ ...primaryBtn, opacity: !editing.title.trim() ? 0.6 : 1 }}>{saving ? 'Saving…' : 'Save project'}</button>
            </div>
          </div>
        </Modal>
      )}
      <style>{`@media (max-width:900px){ .y-proj-grid{ grid-template-columns:1fr 1fr !important; } } @media (max-width:560px){ .y-proj-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(22,36,43,0.4)', zIndex: 60 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 560, maxWidth: '92vw', maxHeight: '88vh', overflowY: 'auto', background: COLORS.cream, borderRadius: 18, zIndex: 70, boxShadow: '0 30px 70px -30px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '20px 26px', borderBottom: '1px solid rgba(45,70,84,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: COLORS.cream }}>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 22, margin: 0, color: COLORS.ink }}>{title}</h2>
          <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: 22, color: COLORS.warm }}>✕</button>
        </div>
        <div style={{ padding: 26 }}>{children}</div>
      </div>
    </>
  );
}

const primaryBtn: React.CSSProperties = { cursor: 'pointer', border: 'none', textDecoration: 'none', background: COLORS.accent, color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 18px', borderRadius: 999 };
const ghostBtn: React.CSSProperties = { cursor: 'pointer', border: '1px solid #D8CDB6', background: '#fff', color: COLORS.ink, fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 999 };
