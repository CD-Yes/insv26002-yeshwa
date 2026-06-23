/**
 * Client-side helper for the secure R2 upload flow.
 * The browser never holds R2 credentials — it calls the Cloudflare Pages
 * Function at `/api/upload-url`, which validates the admin session and either
 * proxies the upload to R2 or returns a signed URL.
 */
import { validateImageFile } from './validation';

export interface UploadResult {
  public_url: string;
  file_key: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export interface UploadOptions {
  /** Logical folder/purpose, e.g. 'gallery' | 'projects' | 'blog' | 'media'. */
  purpose?: string;
  accessToken?: string | null;
}

/**
 * Upload a file via the Pages Function. Validates type/size client-side first
 * (defence in depth — the function re-validates server-side).
 */
export async function uploadImage(
  file: File,
  opts: UploadOptions = {},
): Promise<UploadResult> {
  const err = validateImageFile(file);
  if (err) throw new Error(err);

  const form = new FormData();
  form.append('file', file);
  form.append('file_name', file.name);
  form.append('file_type', file.type);
  form.append('file_size', String(file.size));
  form.append('purpose', opts.purpose ?? 'media');

  const res = await fetch('/api/upload-url', {
    method: 'POST',
    headers: opts.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : undefined,
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}). ${detail}`.trim());
  }
  return (await res.json()) as UploadResult;
}
