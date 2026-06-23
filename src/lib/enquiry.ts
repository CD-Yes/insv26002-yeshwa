/**
 * Client helper to submit an enquiry.
 * Primary path: POST to the Cloudflare Pages Function `/api/enquiry` (validates,
 * inserts with the service role, fires the optional webhook).
 * Fallback: direct Supabase insert (RLS allows anonymous INSERT on `enquiries`).
 */
import { supabase } from './supabaseClient';
import { validateEnquiry, type EnquiryInput } from './validation';

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitEnquiry(raw: Partial<EnquiryInput>): Promise<SubmitResult> {
  const result = validateEnquiry(raw);
  if (!result.ok) {
    return { ok: false, error: Object.values(result.errors)[0] };
  }
  const payload = result.value;

  // 1) Try the Pages Function.
  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    // 404/405 => function not deployed (local/dev): fall through to Supabase.
    if (res.status !== 404 && res.status !== 405) {
      const detail = await res.text().catch(() => '');
      // Still try the fallback below, but remember the error.
      if (!supabase) return { ok: false, error: detail || 'Submission failed.' };
    }
  } catch {
    // Network/function unavailable — fall through.
  }

  // 2) Fallback: direct insert via anon client.
  if (supabase) {
    const { error } = await supabase.from('enquiries').insert({
      ...payload,
      status: 'new',
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  // 3) No backend configured at all (pure static preview): accept optimistically.
  return { ok: true };
}
