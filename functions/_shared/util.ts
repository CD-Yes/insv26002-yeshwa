/**
 * Shared helpers for Cloudflare Pages Functions.
 * Runtime: Cloudflare Workers (Pages Functions). No Node APIs.
 */

export interface Env {
  // Supabase (server-side)
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  // Public anon (used to verify a user's JWT)
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  // R2
  R2_BUCKET?: R2Bucket; // binding (preferred)
  R2_PUBLIC_BASE_URL?: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  // Webhook
  MAKE_OR_N8N_WEBHOOK_URL?: string;
}

// Minimal R2 binding type (avoids requiring @cloudflare/workers-types at build).
export interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream | string, options?: unknown): Promise<unknown>;
  get(key: string): Promise<unknown>;
  delete(key: string): Promise<void>;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS });
}

export function supabaseUrl(env: Env): string | undefined {
  return env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
}
