/** Lightweight, dependency-free validation used by forms + functions. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EnquiryInput {
  name: string;
  phone: string;
  email: string;
  location?: string;
  requirement_type?: string;
  budget_range?: string;
  message?: string;
  source?: string;
}

export type ValidationResult =
  | { ok: true; value: EnquiryInput }
  | { ok: false; errors: Record<string, string> };

export function validateEnquiry(raw: Partial<EnquiryInput>): ValidationResult {
  const errors: Record<string, string> = {};
  const name = (raw.name ?? '').trim();
  const phone = (raw.phone ?? '').trim();
  const email = (raw.email ?? '').trim();

  if (name.length < 2) errors.name = 'Please enter your name.';
  if (phone.replace(/\D/g, '').length < 7) errors.phone = 'Please enter a valid phone number.';
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email.';
  if ((raw.message ?? '').length > 4000) errors.message = 'Message is too long.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      phone,
      email,
      location: (raw.location ?? '').trim() || undefined,
      requirement_type: raw.requirement_type || undefined,
      budget_range: raw.budget_range || undefined,
      message: (raw.message ?? '').trim() || undefined,
      source: raw.source || 'website',
    },
  };
}

/** Allowed image upload constraints (Phase 6). */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPG, PNG or WebP images are allowed.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Image is larger than 5 MB. Please choose a smaller file.';
  }
  return null;
}
