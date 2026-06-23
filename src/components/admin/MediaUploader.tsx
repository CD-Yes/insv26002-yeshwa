import { useRef, useState } from 'react';
import { COLORS } from '@/data/siteConfig';
import { uploadImage, type UploadResult } from '@/lib/r2';
import { validateImageFile } from '@/lib/validation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/providers/AuthProvider';

interface MediaUploaderProps {
  purpose: string;
  onUploaded: (result: UploadResult) => void;
  /** Also record the asset in media_assets (default true). */
  record?: boolean;
  height?: number;
  hint?: string;
}

/**
 * Drag-and-drop / click image uploader. Sends the file to the secure R2 Pages
 * Function and (optionally) records it in media_assets. Validates type + size
 * client-side first; the function re-validates server-side.
 */
export function MediaUploader({ purpose, onUploaded, record = true, height = 150, hint = 'JPG, PNG or WebP · up to 5MB' }: MediaUploaderProps) {
  const { accessToken, profile } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    const v = validateImageFile(file);
    if (v) {
      setError(v);
      return;
    }
    setBusy(true);
    try {
      const result = await uploadImage(file, { purpose, accessToken });
      if (record && supabase) {
        await supabase.from('media_assets').insert({
          file_name: result.file_name,
          file_key: result.file_key,
          public_url: result.public_url,
          file_type: result.file_type,
          file_size: result.file_size,
          uploaded_by: profile?.id ?? null,
        });
      }
      onUploaded(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          height,
          border: `2px dashed ${dragOver ? COLORS.accent : '#D8CDB6'}`,
          borderRadius: 12,
          cursor: busy ? 'wait' : 'pointer',
          background: dragOver ? '#FBF2E6' : '#FBF7EF',
          transition: 'border-color .2s, background .2s',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 26 }}>{busy ? '…' : '↑'}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{busy ? 'Uploading…' : 'Click or drag to upload'}</span>
        <span style={{ fontSize: 12, color: COLORS.warm }}>{hint}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          style={{ display: 'none' }}
        />
      </label>
      {error && <p style={{ color: '#C0392B', fontSize: 13, margin: '8px 0 0' }}>{error}</p>}
    </div>
  );
}
