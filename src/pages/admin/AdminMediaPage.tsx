import { COLORS, FONTS } from '@/data/siteConfig';
import { useSeo } from '@/lib/seo';
import { supabase } from '@/lib/supabaseClient';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { SmoothImage } from '@/components/common/SmoothImage';
import { useAdminTable } from '@/hooks/useAdminTable';
import { formatShortDate } from '@/lib/formatDate';
import type { MediaAsset } from '@/lib/types';

function formatSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AdminMediaPage() {
  useSeo({ title: 'Media · Admin', noindex: true });
  const { rows, loading, refetch, setRows } = useAdminTable<MediaAsset>('media_assets');

  async function remove(asset: MediaAsset) {
    if (!supabase || !window.confirm(`Remove "${asset.file_name}" from the library? (The R2 object is not deleted.)`)) return;
    setRows((l) => l.filter((r) => r.id !== asset.id));
    await supabase.from('media_assets').delete().eq('id', asset.id);
  }

  return (
    <div>
      <AdminTopbar eyebrow="Website" title="Media library" />
      <div style={{ padding: '30px 32px' }}>
        <div style={{ maxWidth: 520, marginBottom: 26 }}>
          <MediaUploader purpose="media" onUploaded={() => refetch()} height={130} />
        </div>

        {loading ? (
          <LoadingState minHeight={200} />
        ) : rows.length === 0 ? (
          <EmptyState icon="◰" title="No media yet" description="Uploaded images are catalogued here and stored in Cloudflare R2." />
        ) : (
          <div className="y-media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {rows.map((m) => (
              <div key={m.id} style={{ background: '#fff', border: '1px solid rgba(45,70,84,0.1)', borderRadius: 12, overflow: 'hidden' }}>
                <SmoothImage src={m.public_url} alt={m.file_name} style={{ height: 130 }} />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.file_name}</div>
                  <div style={{ fontSize: 11.5, color: COLORS.warm, fontFamily: FONTS.sans }}>{formatSize(m.file_size)} · {formatShortDate(m.created_at)}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => navigator.clipboard?.writeText(m.public_url)} style={mini}>Copy URL</button>
                    <button onClick={() => remove(m)} style={{ ...mini, color: '#C0392B' }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@media (max-width:1000px){ .y-media-grid{ grid-template-columns:repeat(3,1fr) !important; } } @media (max-width:700px){ .y-media-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>
    </div>
  );
}

const mini: React.CSSProperties = { cursor: 'pointer', border: '1px solid #E3D2C2', background: 'transparent', color: COLORS.slate, fontSize: 11.5, fontWeight: 600, padding: '5px 9px', borderRadius: 7 };
