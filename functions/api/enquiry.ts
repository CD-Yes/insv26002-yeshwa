import { type Env, json, error, preflight, supabaseUrl } from '../_shared/util';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PagesContext {
  request: Request;
  env: Env;
}

interface EnquiryBody {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  requirement_type?: string;
  budget_range?: string;
  message?: string;
  source?: string;
}

/**
 * Enquiry intake.
 *  1) Validate input.
 *  2) Insert into Supabase `enquiries` using the service role.
 *  3) Optionally POST to a Make.com / n8n webhook (non-blocking failure).
 */
export const onRequestOptions = () => preflight();

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  let body: EnquiryBody;
  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return error('Invalid JSON body.', 400);
  }

  const name = (body.name ?? '').trim();
  const phone = (body.phone ?? '').trim();
  const email = (body.email ?? '').trim();

  if (name.length < 2) return error('A valid name is required.', 422);
  if (phone.replace(/\D/g, '').length < 7) return error('A valid phone number is required.', 422);
  if (!EMAIL_RE.test(email)) return error('A valid email is required.', 422);

  const record = {
    name,
    phone,
    email,
    location: (body.location ?? '').trim() || null,
    requirement_type: body.requirement_type || null,
    budget_range: body.budget_range || null,
    message: (body.message ?? '').trim().slice(0, 4000) || null,
    source: body.source || 'website',
    status: 'new',
  };

  // Insert via service role.
  const base = supabaseUrl(env);
  const svc = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !svc) return error('Server not configured for enquiries.', 500);

  const res = await fetch(`${base}/rest/v1/enquiries`, {
    method: 'POST',
    headers: {
      apikey: svc,
      Authorization: `Bearer ${svc}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return error(`Could not save enquiry. ${detail}`.trim(), 502);
  }

  // Fire-and-forget webhook notification.
  if (env.MAKE_OR_N8N_WEBHOOK_URL) {
    try {
      await fetch(env.MAKE_OR_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'enquiry.created', data: record }),
      });
    } catch {
      // notification is best-effort; the enquiry is already saved
    }
  }

  return json({ ok: true });
};
