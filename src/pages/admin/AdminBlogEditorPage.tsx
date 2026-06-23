import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { LoadingState } from '@/components/common/LoadingState';
import { SmoothImage } from '@/components/common/SmoothImage';
import { useAuth } from '@/app/providers/AuthProvider';
import { uniqueSlug, slugify } from '@/lib/slug';
import { logAudit } from '@/lib/audit';
import { BLOG_CATEGORIES } from '@/data/staticSeed';
import type { BlogPost, PostStatus } from '@/lib/types';

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: COLORS.slate, marginBottom: 7 };

export function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { profile } = useAuth();
  useSeo({ title: isNew ? 'New post · Admin' : 'Edit post · Admin', noindex: true });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', category: BLOG_CATEGORIES[1], excerpt: '', content_html: '', content_json: null as unknown,
    cover_image_url: '', cover_image_key: '', author: 'Yeshwa Studio',
    seo_title: '', seo_description: '', status: 'draft' as PostStatus,
  });

  useEffect(() => {
    if (isNew || !supabase || !id) return;
    let active = true;
    supabase.from('blog_posts').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!active || !data) { setLoading(false); return; }
      const p = data as BlogPost;
      setForm({
        title: p.title, category: p.category ?? BLOG_CATEGORIES[1], excerpt: p.excerpt ?? '',
        content_html: p.content_html ?? '', content_json: p.content_json,
        cover_image_url: p.cover_image_url ?? '', cover_image_key: p.cover_image_key ?? '',
        author: p.author ?? 'Yeshwa Studio', seo_title: p.seo_title ?? '', seo_description: p.seo_description ?? '',
        status: p.status,
      });
      setLoading(false);
    });
    return () => { active = false; };
  }, [id, isNew]);

  function up<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function persist(nextStatus?: PostStatus) {
    if (!supabase || !form.title.trim()) { setToast('A title is required.'); return; }
    setSaving(true);
    const status = nextStatus ?? form.status;
    const payload = {
      title: form.title.trim(),
      category: form.category,
      excerpt: form.excerpt || null,
      content_html: form.content_html || null,
      content_json: form.content_json,
      cover_image_url: form.cover_image_url || null,
      cover_image_key: form.cover_image_key || null,
      author: form.author || null,
      seo_title: form.seo_title || form.title,
      seo_description: form.seo_description || form.excerpt || null,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };

    let savedId = id;
    if (isNew) {
      const slug = uniqueSlug(form.title, []);
      const { data, error } = await supabase.from('blog_posts').insert({ ...payload, slug }).select('id').single();
      if (error) { setSaving(false); setToast(error.message); return; }
      savedId = data.id;
    } else {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', id);
      if (error) { setSaving(false); setToast(error.message); return; }
    }
    await logAudit(profile?.id ?? null, isNew ? 'blog.create' : 'blog.update', 'blog_posts', savedId, { status });
    setForm((f) => ({ ...f, status }));
    setSaving(false);
    setToast(status === 'published' ? 'Published!' : 'Saved as draft.');
    if (isNew && savedId) navigate(`/admin/blogs/${savedId}`, { replace: true });
    setTimeout(() => setToast(null), 2400);
  }

  if (loading) return <LoadingState minHeight="60vh" label="Loading post…" />;

  return (
    <div>
      <AdminTopbar
        eyebrow={<Link to="/admin/blogs" style={{ color: COLORS.accent, textDecoration: 'none' }}>← Blog</Link>}
        title={isNew ? 'New post' : 'Edit post'}
        actions={
          <>
            <span style={{ fontSize: 13, fontWeight: 600, color: form.status === 'published' ? '#2C8A53' : COLORS.warm }}>{form.status === 'published' ? 'Published' : 'Draft'}</span>
            <button onClick={() => persist('draft')} disabled={saving} style={ghost}>Save draft</button>
            <button onClick={() => persist('published')} disabled={saving} style={primary}>{form.status === 'published' ? 'Update' : 'Publish'}</button>
          </>
        }
      />

      <div className="y-editor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, padding: 32, alignItems: 'start', maxWidth: 1300 }}>
        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input className="ya-field" style={{ fontFamily: FONTS.serif, fontSize: 26, padding: '14px 16px' }} placeholder="Post title" value={form.title} onChange={(e) => up('title', e.target.value)} />
          <input className="ya-field" placeholder="Short excerpt (shown in cards & previews)" value={form.excerpt} onChange={(e) => up('excerpt', e.target.value)} />
          <RichTextEditor initialHTML={form.content_html} onChange={({ html, json }) => setForm((f) => ({ ...f, content_html: html, content_json: json }))} />
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title="Cover image">
            {form.cover_image_url ? (
              <div style={{ position: 'relative' }}>
                <SmoothImage src={form.cover_image_url} alt="cover" style={{ height: 150, borderRadius: 12 }} />
                <button onClick={() => setForm((f) => ({ ...f, cover_image_url: '', cover_image_key: '' }))} style={{ position: 'absolute', top: 8, right: 8, border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 12 }}>Replace</button>
              </div>
            ) : (
              <MediaUploader purpose="blog" onUploaded={(r) => setForm((f) => ({ ...f, cover_image_url: r.public_url, cover_image_key: r.file_key }))} />
            )}
          </Card>

          <Card title="Details">
            <label style={{ display: 'block', marginBottom: 14 }}>
              <span style={lbl}>Category</span>
              <select className="ya-field" value={form.category} onChange={(e) => up('category', e.target.value)}>{BLOG_CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label style={{ display: 'block' }}>
              <span style={lbl}>Author</span>
              <input className="ya-field" value={form.author} onChange={(e) => up('author', e.target.value)} />
            </label>
            {!isNew && <p style={{ fontSize: 12.5, color: COLORS.warm, margin: '12px 0 0' }}>URL slug: /blog/{slugify(form.title)}</p>}
          </Card>

          <Card title="Search & sharing (SEO)">
            <label style={{ display: 'block', marginBottom: 14 }}>
              <span style={lbl}>SEO title</span>
              <input className="ya-field" placeholder={form.title} value={form.seo_title} onChange={(e) => up('seo_title', e.target.value)} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={lbl}>Meta description <span style={{ color: COLORS.warm, fontWeight: 400 }}>{form.seo_description.length}/160</span></span>
              <textarea className="ya-field" rows={3} maxLength={200} value={form.seo_description} onChange={(e) => up('seo_description', e.target.value)} />
            </label>
          </Card>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 80, background: COLORS.ink, color: COLORS.cream, fontSize: 14, fontWeight: 600, padding: '14px 24px', borderRadius: 999, boxShadow: '0 18px 40px -16px rgba(0,0,0,0.5)' }}>{toast}</div>
      )}
      <style>{`@media (max-width: 980px){ .y-editor-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 14, padding: 20 }}>
      <h3 style={{ fontFamily: FONTS.serif, fontWeight: 400, fontSize: 17, margin: '0 0 14px', color: COLORS.ink }}>{title}</h3>
      {children}
    </div>
  );
}

const primary: React.CSSProperties = { cursor: 'pointer', border: 'none', background: COLORS.accent, color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 20px', borderRadius: 999 };
const ghost: React.CSSProperties = { cursor: 'pointer', border: '1px solid #D8CDB6', background: '#fff', color: COLORS.ink, fontSize: 14, fontWeight: 600, padding: '11px 18px', borderRadius: 999 };
