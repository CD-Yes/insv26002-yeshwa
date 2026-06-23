import { type Env, json, error, preflight } from '../_shared/util';
import { getStaffUser } from '../_shared/auth';

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp',
};
const PURPOSES = ['gallery', 'projects', 'blog', 'media'];

interface PagesContext {
  request: Request;
  env: Env;
}

/**
 * Secure R2 upload endpoint.
 *  - Validates the admin/editor session (Bearer token).
 *  - Validates image type + size + folder.
 *  - Uploads to the R2 bucket binding and returns the public URL + key.
 * R2 credentials never reach the browser.
 */
export const onRequestOptions = () => preflight();

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  // 1) Auth
  const user = await getStaffUser(request, env);
  if (!user) return error('Unauthorised. Admin or editor session required.', 401);

  // 2) Parse multipart form
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error('Expected multipart/form-data.', 400);
  }
  const file = form.get('file');
  if (!(file instanceof File)) return error('No file provided.', 400);

  const type = (form.get('file_type') as string) || file.type;
  const size = Number(form.get('file_size')) || file.size;
  const purpose = ((form.get('purpose') as string) || 'media').toLowerCase();

  // 3) Validate
  if (!ALLOWED.includes(type)) return error('Only JPG, PNG or WebP images are allowed.', 415);
  if (size > MAX_BYTES) return error('Image exceeds the 5 MB limit.', 413);
  const folder = PURPOSES.includes(purpose) ? purpose : 'media';

  // 4) Build a collision-resistant key
  const ext = EXT[type] ?? 'bin';
  const rand = crypto.randomUUID();
  const key = `${folder}/${Date.now()}-${rand}.${ext}`;

  // 5) Store in R2
  if (!env.R2_BUCKET) {
    return error('R2 bucket binding (R2_BUCKET) is not configured.', 500);
  }
  const buffer = await file.arrayBuffer();
  await env.R2_BUCKET.put(key, buffer, { httpMetadata: { contentType: type } } as unknown);

  const base = (env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!base) return error('R2_PUBLIC_BASE_URL is not configured.', 500);

  return json({
    public_url: `${base}/${key}`,
    file_key: key,
    file_name: file.name,
    file_type: type,
    file_size: size,
  });
};
