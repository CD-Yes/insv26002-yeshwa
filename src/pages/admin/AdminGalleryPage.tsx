import { useState } from 'react';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { PageStatusToggle } from '@/components/admin/PageStatusToggle';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { SmoothImage } from '@/components/common/SmoothImage';
import { useAdminTable } from '@/hooks/useAdminTable';
import { uniqueSlug } from '@/lib/slug';
import { GALLERY_ALBUMS, STRIPE_A } from '@/data/staticSeed';
import type { GalleryItem } from '@/lib/types';

export function AdminGalleryPage() {
  useSeo({ title: 'Gallery · Admin', noindex: true });
  const { rows, loading, refetch, setRows } = useAdminTable<GalleryItem>('gallery_items', { orderBy: 'sort_order', ascending: true });
  const [draft, setDraft] = useState({ title: '', category: GALLERY_ALBUMS[1], description: '', image_url: '', image_key: '' });
  const [saving, setSaving] = useState(false);

  async function addItem() {
    if (!supabase || !draft.title.trim()) return;
    setSaving(true);
    const slug = uniqueSlug(draft.title, rows.map((r) => r.slug));
    const { error } = await supabase.from('gallery_items').insert({
      title: draft.title.trim(),
      slug,
      category: draft.category,
      description: draft.description || null,
      image_url: draft.image_url || null,
      image_key: draft.image_key || null,
      sort_order: rows.length,
      is_published: true,
    });
    setSaving(false);
    if (!error) {
      setDraft({ title: '', category: GALLERY_ALBUMS[1], description: '', image_url: '', image_key: '' });
      refetch();
    }
  }

  async function togglePublish(item: GalleryItem, next: boolean) {
    if (!supabase) return;
    setRows((l) => l.map((r) => (r.id === item.id ? { ...r, is_published: next } : r)));
    await supabase.from('gallery_items').update({ is_published: next }).eq('id', item.id);
  }

  async function remove(item: GalleryItem) {
    if (!supabase || !window.confirm(`Delete "${item.title}"?`)) return;
    setRows((l) => l.filter((r) => r.id !== item.id));
    await supabase.from('gallery_items').delete().eq('id', item.id);
  }

  return (
    <div>
      <AdminTopbar eyebrow="Website" title="Gallery" />
      <div style={{ padding: '30px 32px' }}>
        {/* Add new */}
        <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 16, padding: 24, marginBottom: 26 }}>
          <h2 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 19, margin: '0 0 16px', color: COLORS.ink }}>Add a gallery image</h2>
          <div className="y-gal-form" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>
            <div>
              {draft.image_url ? (
                <div style={{ position: 'relative' }}>
                  <SmoothImage src={draft.image_url} alt="preview" style={{ height: 150, borderRadius: 12 }} />
                  <button onClick={() => setDraft((d) => ({ ...d, image_url: '', image_key: '' }))} style={{ position: 'absolute', top: 8, right: 8, border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>Replace</button>
                </div>
              ) : (
                <MediaUploader purpose="gallery" onUploaded={(r) => setDraft((d) => ({ ...d, image_url: r.public_url, image_key: r.file_key }))} />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input className="ya-field" placeholder="Title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              <select className="ya-field" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                {GALLERY_ALBUMS.filter((a) => a !== 'All albums').map((a) => <option key={a}>{a}</option>)}
              </select>
              <textarea className="ya-field" rows={2} placeholder="Description (optional)" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
              <button onClick={addItem} disabled={saving || !draft.title.trim()} style={{ alignSelf: 'flex-start', cursor: 'pointer', border: 'none', background: COLORS.accent, color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 22px', borderRadius: 999, opacity: !draft.title.trim() ? 0.6 : 1 }}>{saving ? 'Adding…' : 'Add image'}</button>
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <LoadingState minHeight={200} />
        ) : rows.length === 0 ? (
          <EmptyState icon="◳" title="No gallery images yet" description="Upload your first project photo above." />
        ) : (
          <div className="y-gal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {rows.map((item) => (
              <div key={item.id} style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 14, overflow: 'hidden' }}>
                <SmoothImage src={item.image_url} alt={item.title} placeholder={STRIPE_A} placeholderLabel={`[ ${item.title} ]`} style={{ height: 160 }} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                      <div style={{ fontSize: 12.5, color: COLORS.warm }}>{item.category}</div>
                    </div>
                    <PageStatusToggle on={item.is_published} onChange={(n) => togglePublish(item, n)} label="Publish" />
                  </div>
                  <button onClick={() => remove(item)} style={{ marginTop: 12, cursor: 'pointer', border: '1px solid #E3D2C2', background: 'transparent', color: '#C0392B', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 999 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width:900px){ .y-gal-form{ grid-template-columns:1fr !important; } .y-gal-grid{ grid-template-columns:1fr 1fr !important; } } @media (max-width:560px){ .y-gal-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
